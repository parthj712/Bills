"use client";

import {
    Box,
    Typography,
    Grid,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Divider,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSubscriptionExpiry } from "@/service/subscriptionService";

export default function MainHelpPage() {
    const [subscription, setSubscription] = useState("");

    const fetchSubscription = async () => {
        try {
            const res = await getSubscriptionExpiry();
            setSubscription(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);
    console.log("subscriptio", subscription);

    const adminFaqs = [
        {
            question: "How do I add or edit menu items?",
            answer:
                "Go to Menu Management → Add Item or Edit existing item → Save changes.",
        },
        {
            question: "How can I view sales reports?",
            answer:
                "Navigate to Reports → Select Sales Report → Choose date range → Export if needed.",
        },
        {
            question: "How do I manage staff accounts?",
            answer:
                "Go to Staff Management → Add Staff → Assign role and permissions.",
        },
        {
            question: "How do I renew my subscription?",
            answer:
                "Go to Settings → Subscription → Click Renew Plan and complete payment.",
        },
    ];

    const serviceFaqs = [
        {
            question: "How do I create a new bill?",
            answer:
                "Open Billing → Select items → Choose payment method → Click Confirm.",
        },
        {
            question: "How do I apply discount on a bill?",
            answer:
                "While billing, click on Discount → Enter percentage or amount → Confirm.",
        },
        {
            question: "How do I reprint a bill?",
            answer: "Go to Bills → Search by bill number → Click Reprint.",
        },
        {
            question: "What should I do if payment fails?",
            answer:
                "Retry payment or switch to another payment mode. If issue continues, contact Admin.",
        },
    ];
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <Box p={2} bgcolor="#f9fafb" minHeight="100vh">
            {/* PAGE HEADER */}
            <Typography
                fontSize={28}
                fontWeight={700}
                mb={1}
                className="text-[#000C5A]"
            >
                Help & Support
            </Typography>

            <Typography color="text.secondary" mb={4}>
                We are here to help you manage your business smoothly.
            </Typography>

            {/* QUICK SUPPORT CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {[
                    {
                        title: "Contact Support",
                        icon: <SupportAgentIcon />,
                        desc: "Talk directly with our support team.",
                        action: () => window.open("tel:+917350304508"),
                    },
                    {
                        title: "WhatsApp Support",
                        icon: <WhatsAppIcon />,
                        desc: "Get instant help via WhatsApp.",
                        action: () =>
                            window.open("https://wa.me/919545934174", "_blank"),
                    },
                    {
                        title: "Email Support",
                        icon: <EmailIcon />,
                        desc: "Send us your query anytime.",
                        action: () =>
                            window.open(
                                "mailto:billflowpos37@gmail.com?subject=BillFlow POS Support Request"
                            ),
                    },
                ].map((item) => (
                    <motion.div key={item.title} whileHover={{ y: -5 }}>
                        <Paper
                            elevation={0}
                            onClick={item.action}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: "1px solid #fde3c8",
                                background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": {
                                    boxShadow: "0 8px 20px rgba(249,115,22,0.2)",
                                },
                            }}
                        >
                            <Box color="#ea580c" mb={1}>
                                {item.icon}
                            </Box>

                            <Typography fontWeight={600}>{item.title}</Typography>

                            <Typography fontSize={14} color="text.secondary">
                                {item.desc}
                            </Typography>
                        </Paper>
                    </motion.div>
                ))}
            </div>

            {/* ADMIN FAQ SECTION */}
            <Typography fontSize={22} fontWeight={600} mb={2} color="black">
                Admin Panel – FAQs
            </Typography>

            <Box mb={5}>
                {adminFaqs.map((faq, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            border: "1px solid #f1f5f9",
                            "&:before": { display: "none" },
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* SERVICE CONSOLE FAQ SECTION */}
            <Typography fontSize={22} fontWeight={600} mb={2} color="black">
                Service Console – FAQs
            </Typography>

            <Box mb={5}>
                {serviceFaqs.map((faq, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            border: "1px solid #f1f5f9",
                            "&:before": { display: "none" },
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* SUBSCRIPTION INFO */}
            <Typography fontSize={22} fontWeight={600} mb={2} color="black">
                Subscription Status
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid #fde3c8",
                    background: "#fff7ed",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box>
                        <Typography fontWeight={600}>Current Plan</Typography>
                        <Chip
                            label={subscription.planType}
                            color="warning"
                            sx={{ mt: 1 }}
                        />
                    </Box>

                    <Box>
                        <Typography fontWeight={600}>Expiry Date</Typography>
                        <Typography color="text.secondary">
                            {" "}
                            {formatDate(subscription.expiresAt)}
                        </Typography>
                    </Box>

                    {/* <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#ea580c",
                            "&:hover": { bgcolor: "#c2410c" },
                        }}
                    >
                        Renew Plan
                    </Button> */}
                </Box>
            </Paper>

            {/* SYSTEM INFO FOOTER */}
            <Divider sx={{ my: 5 }} />

            <Box textAlign="center">
                <Typography fontSize={14} color="text.secondary">
                    System Status: <b>Operational</b> | Version: v1.2.4
                </Typography>
            </Box>
        </Box>
    );
}
