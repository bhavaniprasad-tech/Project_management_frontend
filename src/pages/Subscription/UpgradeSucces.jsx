import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import { store } from "@/Redux/Store"
import { CheckCircledIcon } from "@radix-ui/react-icons"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getUserSubscription, upgradeSubscription } from "@/Redux/Subscription/Action"

const UpgradeSuccess = () => {
    console.log("UpgradeSuccess component rendering...");
    
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { subscription } = useSelector(store => store)

    console.log("Location:", location);
    console.log("Subscription state:", subscription);

    const queryParams = new URLSearchParams(location.search)

    const paymentId = queryParams.get("payment_id");
    const planType = queryParams.get("planType");

    console.log("PaymentId:", paymentId);
    console.log("PlanType:", planType);

    useEffect(() => {
        console.log("useEffect triggered with planType:", planType);
        if (planType) {
            dispatch(upgradeSubscription({planType}))
        }
        dispatch(getUserSubscription())
    }, [planType, dispatch]);

    // Console log the subscription data for debugging
    useEffect(() => {
        if (subscription.userSubscription) {
            console.log("Subscription data:", subscription.userSubscription);
            console.log("Start date:", subscription.userSubscription.subscriptionStartDate);
            console.log("End date:", subscription.userSubscription.subscriptionEndDate);
            console.log("Plan type:", subscription.userSubscription.planType);
        }
    }, [subscription.userSubscription]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPlanTypeDisplay = (planType) => {
        switch(planType) {
            case 'ANNUALLY': return 'Annual Plan';
            case 'M': return 'Monthly Plan';
            case 'FREE': return 'Free Plan';
            default: return planType || 'N/A';
        }
    };

    console.log("About to render component...");

    try {
        return (
            <div className="flex justify-center items-start min-h-screen bg-gray-900 p-4">
                <div className="mt-10 p-3 space-y-2 flex flex-col items-center bg-gray-800 border border-gray-700 rounded-lg w-fit h-fit">
                    <div className="flex items-center gap-3">
                        <CheckCircledIcon className="h-6 w-6 text-green-500"/>
                        <h2 className="text-lg font-semibold text-gray-400">Plan Upgraded Successfully</h2>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="text-green-500">
                            Start Date: {subscription?.userSubscription ? 
                                formatDate(subscription.userSubscription.subscriptionStartDate) : 
                                'Loading...'}
                        </p>
                        <p className="text-red-500">
                            End Date: {subscription?.userSubscription ? 
                                formatDate(subscription.userSubscription.subscriptionEndDate) : 
                                'Loading...'}
                        </p>
                        <p className="text-white">
                            Plan Type: {subscription?.userSubscription ? 
                                getPlanTypeDisplay(subscription.userSubscription.planType) : 
                                'Loading...'}
                        </p>
                        {paymentId && (
                            <p className="text-blue-400">
                                Payment ID: {paymentId}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={() => navigate("/")} 
                        className="mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        )
    } catch (error) {
        console.error("Error rendering UpgradeSuccess:", error);
        return (
            <div className="flex justify-center min-h-screen bg-gray-900 p-4">
                <div className="mt-20 p-5 text-white">
                    <h1>Error occurred</h1>
                    <p>Check console for details</p>
                    <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }
}

export default UpgradeSuccess