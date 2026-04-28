import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyRegistrationOTPMutation, useResendRegistrationOTPMutation } from "../../services/api";
import { addUser } from "../../redux/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthLayout from "../../layouts/authLayout";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyRegistrationOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendRegistrationOTPMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Get email from localStorage
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");
    if (!pendingEmail) {
      toast.error("No pending verification found");
      navigate("/sign-up");
      return;
    }
    setEmail(pendingEmail);

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    try {
      const result = await verifyOTP({
        email: email,
        otp: otpString
      });

      if (result.data) {
        localStorage.removeItem("pendingVerificationEmail");
        localStorage.setItem("userId", result.data.data._id);
        dispatch(addUser(result.data.data));
        toast.success("Account verified successfully!");
        navigate("/dashboard");
      } else {
        toast.error(result.error?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP({ email });
      
      if (result.data) {
        toast.success("New OTP sent to your email");
        setTimer(600); // Reset timer to 10 minutes
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]); // Clear current OTP
        
        // Restart timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(result.error?.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const handleBackToSignUp = () => {
    localStorage.removeItem("pendingVerificationEmail");
    navigate("/sign-up");
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold font-workSans mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 font-workSans">
            We&#39;ve sent a 6-digit verification code to
          </p>
          <p className="text-mainGreen font-semibold font-workSans">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 md:p-8">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-mainGreen focus:outline-none"
                autoComplete="off"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <p className="text-gray-600 font-workSans">
                Code expires in: <span className="font-semibold text-red-500">{formatTime(timer)}</span>
              </p>
            ) : (
              <p className="text-red-500 font-workSans font-semibold">
                Code has expired
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isVerifying || timer === 0}
            className="w-full bg-mainGreen text-white py-3 px-5 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-workSans font-semibold mb-4"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend OTP */}
          <div className="text-center mb-4">
            <p className="text-gray-600 font-workSans mb-2">
              Didn&#39;t receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isResending}
              className="text-mainGreen font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed font-workSans"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          {/* Back to Sign Up */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToSignUp}
              className="text-gray-600 hover:text-gray-800 font-workSans"
            >
              ← Back to Sign Up
            </button>
          </div>

        
        </form>
      </div>
    </AuthLayout>
  );
};

export default OTPVerification;