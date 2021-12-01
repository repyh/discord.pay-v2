import Head from 'next/head';
import paypal from "paypal-rest-sdk";
import fs from "fs";
import db from 'quick.db';

paypal.configure({
    mode:
        process.env.PRODUCTION && process.env.PRODUCTION === "true"
            ? "live"
            : "sandbox",
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET,
});

export default function Success() {
    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen">
            <Head>
                <title>discord.pay - My Bot</title>
            </Head>
            <h1 className="poppins text-gray-600 font-light text-6xl">
                Thank You
            </h1>
            <p className="text-gray-400 roboto font-light mt-2">
                You should received your item(s) shortly
            </p>
        </div>
    );
}

export async function getServerSideProps({ query }) {
    const q = db.get(`success.${query.paymentId}`);
    if(q && q === true) return {
        redirect: {
            permanent: false,
            destination: '/'
        }
    }

    try {
        await new Promise((resolve, reject) => {
            paypal.payment.execute(
                query.paymentId,
                {
                    payer_id: query.PayerID,
                },
                (err, payment) => {
                    if (err) reject(err);
                    resolve(payment);
                }
            );
        });

        const items = query.items.split(",");
        const itemsDir = fs.readdirSync("./items").map((d) => d.split(".")[0]);

        for (const item of items) {
            const { default: execute } = await import(`../items/${item}`);
            try {
                execute(query.user_id);
            } catch (e) {
                console.error(e);
            }
        }

        db.set(`success.${query.paymentId}`, true);

        return {
            props: {
                query,
            },
        };
    } catch (e) {
        console.error(e);
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }
}
