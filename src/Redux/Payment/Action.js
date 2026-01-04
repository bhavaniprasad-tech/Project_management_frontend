import api from "@/config/api"

export const createPayment = ({planType, jwt}) => {
    return async (dispatch) => {
        try{
            console.log("Creating payment for planType:", planType);
            
            // Map planType to ensure backend compatibility
            let mappedPlanType = planType;
            if (planType === "M") {
                mappedPlanType = "MONTHLY"; // Try mapping M to MONTHLY
            }
            
            console.log("Mapped planType:", mappedPlanType);
            
            const {data} = await api.post(`/api/payment/${mappedPlanType}`, {}, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
            console.log("Payment response:", data);
            if(data.payment_link_url){
                window.location.href = data.payment_link_url
            }
        } catch(error) {
            console.log("Payment error for planType:", planType);
            console.log("Payment error:", error);
            console.log("Error response:", error.response?.data);
            console.log("Error status:", error.response?.status);
            
            // If MONTHLY fails, try with original planType
            if (planType === "M" && error.response?.status === 404) {
                console.log("Retrying with original planType 'M'");
                try {
                    const {data} = await api.post(`/api/payment/M`, {}, {
                        headers: {
                            "Authorization": `Bearer ${jwt}`
                        }
                    })
                    console.log("Retry payment response:", data);
                    if(data.payment_link_url){
                        window.location.href = data.payment_link_url
                    }
                } catch(retryError) {
                    console.log("Retry also failed:", retryError);
                }
            }
        }
    }
}