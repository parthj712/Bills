import { Box, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";

const ExpandableText = ({ text }) => {

    const ref = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setShowMore(ref.current.scrollHeight > ref.current.clientHeight);
        }
    }, [text]);


    return (
        <div>

            <Box>
                <motion.div
                    animate={{ height: expanded ? "auto" : 42 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                >
                    <Typography
                        ref={ref}
                        fontSize={15}
                        color="#616161"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: expanded ? "unset" : 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {text}
                    </Typography>
                </motion.div>

                {showMore && (
                    <Typography
                        fontSize={13}
                        fontWeight={600}
                        color="#0b3c5d"
                        sx={{
                            cursor: "pointer",
                            width: "fit-content",
                            mt: 0.5,
                        }}
                        onClick={() => setExpanded((p) => !p)}
                    >
                        {expanded ? "Less" : "More"}
                    </Typography>
                )}
            </Box>
        </div>
    )
}

export default ExpandableText





//  {item.description && (
//                         <ExpandableText text={item.description} />
//                     )}