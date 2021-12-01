import paypal from "paypal-rest-sdk";

paypal.configure({
    mode:
        process.env.PRODUCTION && process.env.PRODUCTION === "true"
            ? "live"
            : "sandbox",
    client_id: process.env.PAYPAL_ID,
    client_secret: process.env.PAYPAL_SECRET,
});

export default function Request(req, res) {
    const baseURL = `${req.secure ? "https" : "http"}://${req.headers.host}`;

    if (req.method !== "POST") return res.status(405);

    const paymentPayload = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: `${baseURL}/success?user_id=${
                req.body.user_id
            }&items=${Object.keys(req.body.items).join(",")}`,
            cancel_url: `${baseURL}/`,
        },
        transactions: [
            {
                items_list: {
                    items: Object.entries(req.body.items).map(
                        ([item, data]) => {
                            return {
                                name: item,
                                price: data.price.toFixed(2),
                                currency: data.currency,
                                quantity: data.quantity,
                            };
                        }
                    ),
                },
                amount: {
                    currency: Object.values(req.body.items)[0].currency,
                    total: Object.values(req.body.items)
                        .map((a) => a.price)
                        .reduce((a, v) => a - -v)
                        .toFixed(2),
                },
                description: "Payment for Discord Bot",
            },
        ],
    };

    paypal.payment.create(paymentPayload, (error, payment) => {
        if (error) throw error;
        const redirect = payment.links.find((p) => p.rel === "approval_url");
        res.status(200).json({
            redirect_url: redirect,
        });
    });
}
