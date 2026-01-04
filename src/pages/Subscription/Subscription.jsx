import SubscriptionCard from "./SubscriptionCard";
import { useSelector } from "react-redux";

const paidPlan = [
  "Add unlimited project",
  "Access to live chat",
  "Add unlimited team member",
  "Advanced Reporting",
  "Priority Support",
  "Customization Options",
  "Integration Support",
  "Advanced Security",
  "Training and Resources",
  "Access Control",
  "Custom Workflows",
];

const annualPlan = [
  "Add unlimited projects",
  "Access to live chat",
  "Add unlimited team member",
  "Advanced Reporting",
  "Priority Support",
  "Everything Which monthly plan has",
];

const freePlan = [
  "Add only 3 projects",
  "Basic talk Management",
  "Project Collaboration",
  "Basic Reporting",
  "Email Notifications",
  "Basic Access Control",
];


const Subscription = () => {
  const {subscription} = useSelector(store => store)
  
  // Handle loading state
  if (subscription.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Loading subscription data...</div>
      </div>
    )
  }

  // Handle error state
  if (subscription.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading subscription: {subscription.error}</div>
      </div>
    )
  }

  // Get current plan type safely
  const currentPlanType = subscription?.userSubscription?.planType || null;

  return (
    <div className="p-10">
      <h1 className="text-5xl font-semibold font-serif py-5 pb-16 text-center">Pricing</h1>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-9">
        <SubscriptionCard data = {{planName:"Free", features:freePlan, planType:"FREE", price: 0,
        buttonName: currentPlanType === "FREE"?"Current Plan":"Get Started",
        }}/>
         <SubscriptionCard data = {{planName:"Monthly Paid Plan", features:paidPlan, planType:"MONTHLY", price: 799,
        buttonName: currentPlanType === "MONTHLY" ?"Current Plan":"Get Started",
        }}/>
          <SubscriptionCard data = {{planName:"Annual Paid Plan", features:annualPlan, planType:"ANNUALLY", price: 6711,
        buttonName: currentPlanType === "ANNUALLY" ?"Current Plan":"Get Started",
        }}/>
      </div>
    </div>
  )
}

export default Subscription
