import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";
import { ImSpinner9 } from "react-icons/im";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

const CheckoutForm = ({ closeModal, bookingInfo, refetch}) => {
  const { user } = useAuth();
  const navigate = useNavigate()
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState();
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (bookingInfo?.price && bookingInfo?.price > 1) {
      getClientSecret({ price: bookingInfo?.price });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingInfo?.price]);

  const getClientSecret = async (price) => {
    const { data } = await axiosSecure.post(`/create-payment-intent`, price);
    setClientSecret(data.clientSecret);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
  
    if (!stripe || !elements) return;
  
    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
  
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
  
    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    } else {
      console.log(paymentMethod);
      setCardError("");
      setProcessing(false);
    }
  
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card, 
        billing_details: {
          name: user?.displayName,
          email: user?.email,
        },
      },
    });
  
    if (confirmError) {
      setCardError(confirmError.message || "Payment failed");
      setProcessing(false);
      return;
    }
  
    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        ...bookingInfo,
        roomId: bookingInfo._id,
        transactionId: paymentIntent.id,
        date: new Date(),
      };
      delete paymentInfo._id;
      try {
         const {data} = await axiosSecure.post('/booking',paymentInfo)
         console.log(data)

        await axiosSecure.patch(`/booking/status/${bookingInfo?._id}`,{
          status: true,
        })

         refetch()
         closeModal()
         toast.success('Room booked successfully')
         navigate('/dashboard/my-bookings')
      } catch (error) {
        console.log(error)
      }
    }
  
    setProcessing(false);
  };
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />

        <div className="flex mt-2 justify-around">
          <button
            disabled={!stripe || !clientSecret || processing}
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            {processing ? (
              <ImSpinner9 className="animate-spin m-auto" size={24} />
            ) : (
              `Pay ${bookingInfo?.price}`
            )}
          </button>
          <button
            onClick={closeModal}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
      {cardError && <p className="text-red-600 ml-8">{cardError}</p>}
    </>
  );
};

CheckoutForm.propTypes = {
  bookingInfo: PropTypes.object,
  closeModal: PropTypes.func,
  refetch: PropTypes.func,
};

export default CheckoutForm;
