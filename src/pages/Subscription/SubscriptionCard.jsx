import { Button } from "@/components/ui/button";
import { createPayment } from "@/Redux/Payment/Action";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";

const SubscriptionCard = ({ data }) => {
  const dispatch = useDispatch();
  const handleUpgrade = () =>{
    dispatch(createPayment({planType : data.planType, jwt : localStorage.getItem("jwt")}))
  }
  const planTypeLabel =
    data.planType === "M" ? "MONTHLY" :
    data.planType === "ANNUALLY" ? "ANNUALLY" :
    "FREE";

  const priceLabel = `₹${data.price}/${planTypeLabel}`;

  const cardBgClass = data.isCurrent
    ? "bg-white text-black"
    : "bg-[#1b1b1b] bg-opacity-20 text-white";

  return (
    <div
      className={`rounded-xl shadow-[#14173b] shadow-2xl card p-5 space-y-5 w-[18rem] ${cardBgClass}`}
    >
      <p className="text-xl font-bold">{data.planName}</p>
      <p className="text-lg font-semibold">{priceLabel}</p>
      {data.planType === "ANNUALLY" && (
        <p className="text-green-500">30% off</p>
      )}

      <Button onClick = {handleUpgrade} className="w-full">
        {data.buttonName}
      </Button>

      <div>
        {data.features.map((item) => (
          <div key={item} className="flex items-center gap-2">
            <CheckCircledIcon />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCard;
