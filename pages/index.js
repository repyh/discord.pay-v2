import Head from "next/head";
import itemsRaw from "../items";
import { useState } from "react";
import { useRouter } from "next/router";

export function getServerSideProps({ req }) {
    const baseURL = `${req.secure ? "https" : "http"}://${req.headers.host}`;
    return {
        props: {
            baseURL,
        },
    };
}

export default function Home({ baseURL }) {
    const [itemState, setItemState] = useState(itemsRaw);
    const [display, setDisplay] = useState(Object.entries(itemState));
    const [toBuy, setToBuy] = useState({});
    const [id, setID] = useState("");
    const router = useRouter();

    function addToCart(item) {
        const temp = itemState;
        temp[item].added = temp[item].added ? !temp[item].added : true;
        setItemState(itemState);
        setDisplay(Object.entries(itemState));

        console.log(temp[item].added);
        if (!temp[item].added) {
            const temp2 = toBuy;
            console.log("ee");
            if (temp2[item]) delete temp2[item];
            setToBuy(temp2);
        }

        if (temp[item].added) {
            const temp2 = {
                ...toBuy,
                [item]: temp[item],
            };
            console.log(temp2);
            setToBuy(temp2);
        }

        console.log(toBuy)
    }

    async function processPayment() {
        if (!Object.keys(toBuy).length)
            return alert("You dont have any items selected!");

        const req = await fetch(`${baseURL}/api/request`, {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: id,
                items: toBuy,
            }),
        }).catch(console.error);

        const res = await req.json();

        console.log(res);
        router.push(res.redirect_url.href);
    }

    return (
        <div className="flex lg:flex-row flex-col w-screen bg-white">
            <Head>
                <title>discord.pay - My Bot</title>
            </Head>
            <div className="flex flex-col h-screen lg:w-1/2 w-full justify-center items-center">
                <h1 className="poppins text-gray-600 text-5xl font-bold">
                    My Bot
                </h1>
                <p className="text-gray-400 roboto font-light mt-2">
                    Please make sure you've inputted the correct id!
                </p>
                <input
                    placeholder="Discord ID"
                    value={id}
                    onChange={(input) => setID(input.target.value)}
                    className="w-96 h-9 px-4 text-sm bg-gray-100 roboto font-light mt-3 rounded focus:outline-none"
                />
                <button
                    onClick={processPayment}
                    className="px-3 py-1.5 mt-3 bg-gray-300 poppins text-white rounded-md hover:bg-gray-400 hover:text-gray-100"
                >
                    Purchase
                </button>
            </div>
            <div className="lg:w-1/2 w-full min-h-screen lg:py-0 py-12 flex flex-col justify-center items-center">
                <div className="w-96 grid grid-cols-1 border-2 rounded overflow-hidden">
                    {display.map(([item, data]) => (
                        <div
                            className="w-full h-12 flex hover:bg-gray-50"
                            key={Math.random()}
                        >
                            <div className="w-1/2 h-full pl-4 flex items-center">
                                <h1 className="poppins text-lg text-gray-500">
                                    {item}{" "}
                                    <span className="text-sm roboto font-light">
                                        - ${data.price.toFixed(2)}
                                    </span>
                                </h1>
                            </div>
                            <div className="w-1/2 h-full pr-4 flex items-center justify-end">
                                <button
                                    onClick={() => addToCart(item)}
                                    className={`px-2 py-0.5 ${
                                        itemState[item].added
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    } rounded roboto text-white`}
                                >
                                    {itemState[item].added
                                        ? "Added"
                                        : "Add Item"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
