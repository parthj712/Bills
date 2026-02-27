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
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    TextField,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

export default function MainHelpPage() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const { showSnackbar } = useAppSnackbar();

    const [subscription, setSubscription] = useState("");
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        category: "",
        issue: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

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


    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter valid 10-digit phone number";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter valid email address";
        }

        if (!formData.issue.trim()) {
            newErrors.issue = "Issue title is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message cannot be empty";
        }
        if (!formData.category) {
            newErrors.category = "Please select issue category";
        }

        if (!formData.issue) {
            newErrors.issue = "Please select issue type";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = () => {



        if (!validateForm()) {
            showSnackbar("Please fix the highlighted errors", "warning");
            return;
        }

        const whatsappMessage = `
            📩 *New Support Ticket - BillFlow POS*

            👤 Name: ${formData.name}
            📞 Phone: ${formData.phone}
            📧 Email: ${formData.email}
            🛠 Issue: ${formData.issue}
            📝 Message: ${formData.message}
            🗂 Category: ${formData.category}
                    🛠 Issue: ${formData.issue}
            `;

        const encodedMessage = encodeURIComponent(whatsappMessage);

        window.open(
            `https://wa.me/919545934174?text=${encodedMessage}`,
            "_blank"
        );

        setOpen(false);

        setFormData({
            name: "",
            phone: "",
            email: "",
            issue: "",
            message: "",
        });
    };


    return (
        <Box p={isMobile ? 1 : 4} bgcolor="#f9fafb" minHeight="100vh">
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
                    // {
                    //     title: "Email Support",
                    //     icon: <EmailIcon />,
                    //     desc: "Send us your query anytime.",
                    //     action: () =>
                    //         window.open(
                    //             "mailto:billflowpos37@gmail.com?subject=BillFlow POS Support Request"
                    //         ),
                    // },
                    {
                        title: "Raise Ticket",
                        icon: <SupportAgentIcon />,
                        desc: "Create a support request via WhatsApp",
                        action: () => setOpen(true),
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
            </Typography>x

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
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems={isMobile ? "stretch" : "center"}
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



            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        fontSize: 22,
                        color: "#0f172a",
                        pb: 0,
                    }}
                >
                    Raise Support Ticket
                </DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        margin="normal"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        fullWidth
                        label="Phone Number"
                        margin="normal"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />

                    <TextField
                        fullWidth
                        label="Email Address"
                        margin="normal"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.category}
                    >
                        <InputLabel>Issue Category</InputLabel>
                        <Select
                            value={formData.category}
                            label="Issue Category"
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                        >
                            <MenuItem value="Billing Problem">Billing Problem</MenuItem>
                            <MenuItem value="Subscription Issue">Subscription Issue</MenuItem>
                            <MenuItem value="Login Issue">Login Issue</MenuItem>
                            <MenuItem value="Printer Not Working">Printer Not Working</MenuItem>
                            <MenuItem value="Feature Request">Feature Request</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {errors.category && (
                            <Typography color="error" fontSize={12} mt={0.5}>
                                {errors.category}
                            </Typography>
                        )}
                    </FormControl>


                    <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.issue}
                    >
                        <InputLabel>Issue Type</InputLabel>
                        <Select
                            value={formData.issue}
                            label="Issue Type"
                            onChange={(e) =>
                                setFormData({ ...formData, issue: e.target.value })
                            }
                        >
                            <MenuItem value="Unable to create bill">Unable to create bill</MenuItem>
                            <MenuItem value="Payment failed">Payment failed</MenuItem>
                            <MenuItem value="Report not generating">Report not generating</MenuItem>
                            <MenuItem value="System slow">System slow</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {errors.issue && (
                            <Typography color="error" fontSize={12} mt={0.5}>
                                {errors.issue}
                            </Typography>
                        )}
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Describe your issue"
                        margin="normal"
                        multiline
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                        }
                        error={!!errors.message}
                        helperText={errors.message}
                    />
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={() => setOpen(false)}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: "#ea580c",
                            px: 3,
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            "&:hover": {
                                bgcolor: "#c2410c",
                            },
                        }}
                    >
                        Submit Ticket
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
