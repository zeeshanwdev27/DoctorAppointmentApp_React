import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { BadgeCheck } from 'lucide-react';

function PaymentSuccess() {
  const { backendUrl, token } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); 
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      try {
        const { data } = await axios.get(
          `${backendUrl}/api/payment/verify-session/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setStatus('success');
          toast.success('Payment Successful!');
        } else {
          setStatus('failed');
          toast.error('Payment not completed.');
        }
      } catch (error) {
        console.log(error);
        setStatus('failed');
        toast.error('Payment verification failed.');
      }
    };

    verifyPayment();
  }, [sessionId]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="flex flex-col items-center p-10 bg-white rounded-2xl shadow-lg max-w-md mx-auto animate-fadeIn">
            <BadgeCheck className="w-20 h-20 text-[#5f6FFF] mb-5" />
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
            <p className="text-gray-500 mb-6 text-center">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
            <Link
              to="/my-appointments"
              className="px-6 py-3 bg-[#5f6FFF] text-white rounded-lg font-medium hover:bg-[#4a54e6] transition"
            >
              View Appointments
            </Link>
          </div>
        );

      case 'failed':
        return (
          <div className="flex flex-col items-center p-10 bg-white rounded-2xl shadow-lg max-w-md mx-auto animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Failed</h1>
            <p className="text-gray-500 mb-6 text-center">
              Something went wrong with your payment. Please try again or contact support.
            </p>
            <Link
              to="/my-appointments"
              className="px-6 py-3 bg-[#5f6FFF] text-white rounded-lg font-medium hover:bg-[#4a54e6] transition"
            >
              Retry Payment
            </Link>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center p-10 bg-white rounded-2xl shadow-lg max-w-md mx-auto animate-pulse">
            <p className="text-gray-500">Processing payment...</p>
          </div>
        );
    }
  };

  return <div className="min-h-screen flex items-center justify-center bg-gray-100">{renderContent()}</div>;
}

export default PaymentSuccess;
