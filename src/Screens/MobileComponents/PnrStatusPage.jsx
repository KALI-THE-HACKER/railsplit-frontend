import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PnrStatusPage() {
    const [pnr, setPnr] = useState("");
    const [loading, setLoading] = useState(false);
    const [pnrData, setPnrData] = useState(null);
    const [error, setError] = useState("");
    const [showNotification, setShowNotification] = useState(true);

    const navigate = useNavigate();
    const apikey = import.meta.env.VITE_RAILSPLIT_API_KEY;

    const handleInputChange = (e) => {
        setPnr(e.target.value.replace(/\D/g, "").slice(0, 10));
    };

    // Prevent body scroll when PNR modal is open
    useEffect(() => {
        if (pnrData) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [pnrData]);

    useEffect(() => {
        setTimeout(() => {
            setShowNotification(false);
        }, 7000); // Hide notification after 7 seconds
        return () => {
            setShowNotification(false);
        }
    }, [])

    useEffect(() => {
        if(pnr=== "8234569935") {
            handleCheckStatus();
        }
    }, [pnr]);

    const handleCheckStatus = async () => {
        setError("");
        setPnrData(null);
        if (pnr.length !== 10) {
            setError("Please enter a valid 10-digit PNR number.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`https://railsplit-server.luckylinux.xyz/pnr-status/${pnr}/apikey/${apikey}`);

            if(response.status == 422) {
                alert("Invalid PNR number. Please check and try again!");
                return;
            }else if(!response.ok){
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            

            setPnrData(json);

        } catch (error) {
            alert(error);
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen h-screen bg-black items-center px-5 py-10">
            {/* Header */}
            <div className="fixed flex flex-row items-center w-full top-5 left-0 z-20">
                <i onClick={() => navigate('/')} className="fa-solid fa-angle-left text-[#767676] text-2xl ml-1 mt-2" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#1D1F24] h-12 w-[90vw] flex justify-center items-center rounded-4xl mt-2">
                    <h2 className="text-white text-2xl font-semibold">PNR Status</h2>
                </div>    
            </div>
            <div className="relative bg-[#1D1F24] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center top-1/2 -translate-y-1/2">
                <h1 className="text-3xl font-bold text-white mb-6">Check PNR Status</h1>
                <input
                    type="text"
                    value={pnr}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit PNR"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#28292E] text-white text-xl mb-4 outline-none border border-gray-600 focus:border-blue-500 transition"
                    inputMode="numeric"
                    pattern="\d*"
                />
                <button
                    onClick={handleCheckStatus}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg transition mb-2"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Get Status"}
                </button>

                {/* Button for testing with a sample PNR */}
                <button
                    type="button"
                    onClick={() => {
                        setPnr("8234569935");
                    }}
                    className="w-full bg-[#28292E] hover:bg-[#383A40] text-white font-semibold py-2 rounded-xl text-base transition mb-2"
                    disabled={loading}
                >
                    Test with Sample PNR
                </button>
                {error && <div className="text-red-400 mt-2">{error}</div>}

            </div>
            {loading  && 
                <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-black/40 flex flex-col gap-7 items-center justify-center backdrop-blur-xs">
                    <span className="loader"></span>
                    <span>Loading...</span>
                </div>
            }

            {pnrData &&
                <div className="fixed top-0 left-0 h-screen w-screen z-50 bg-black/70 flex flex-col gap-7 items-center backdrop-blur-xs px-4 py-8 overflow-y-auto">
                    {/* Close button */}
                    <button
                        onClick={() => setPnrData(null)}
                        className="absolute top-12 right-3 text-neutral-600 text-lg underline font-bold bg-black/30 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition z-50"
                        aria-label="Close"
                    >
                        close
                    </button>
                    <span className="font-bold text-2xl text-center my-5">-: PNR Details :-</span>
                    <div className="bg-white/6 p-5 rounded-3xl w-full max-w-md text-white justify-center text-lg">
                        <p className="mb-2"><strong>PNR Number:</strong> <span className="text-xl">{pnrData.pnr}</span></p>
                        <p className="mb-2"><strong>Train:</strong> <span className="text-xl">{pnrData.train_name}</span></p>
                        <p className="mb-2"><strong>Boarding Station:</strong> <span className="text-xl">{pnrData.from_st_code} | {pnrData.from_st_name}</span></p>
                        <p className="mb-2"><strong>Destination Station:</strong> <span className="text-xl">{pnrData.to_st_code} | {pnrData.to_st_name}</span></p>
                        <p className="mb-2"><strong>Boarding Day:</strong> <span className="text-xl">{pnrData.boarding_day}</span></p>
                        <p className="mb-2"><strong>Departure Time:</strong> <span className="text-xl">{pnrData.departure_time}</span></p>
                        <p className="mb-2"><strong>Arrival Time:</strong> <span className="text-xl">{pnrData.arrival_time}</span></p>
                        <p className="mb-2"><strong>Journey Time:</strong> <span className="text-xl">{pnrData.journey_time}</span></p>
                        <p className="mb-2"><strong>Class:</strong> <span className="text-xl">{pnrData.class}</span></p>
                        <p className="mb-2"><strong>Platform:</strong> <span className="text-xl">{pnrData.platform}</span></p>
                        <p className="mt-4 mb-2 text-xl"><strong>Passenger Details:</strong></p>
                        <ul className="list-disc pl-5">
                            {pnrData.status && pnrData.status.map((passenger, idx) => (
                                <li key={idx} className="mb-4 text-lg">
                                    <p><strong>Passenger:</strong> <span className="text-xl">{passenger.passenger}</span></p>
                                    <p>
                                        <strong>Booking Status: </strong>
                                        {passenger.booking_status === "Confirmed"
                                            ? <span className="text-green-400 text-xl">{passenger.booking_status}</span>
                                            : <span className="text-xl">{passenger.booking_status}</span>
                                        }
                                    </p>
                                    <p>
                                        <strong>Current Status: </strong>
                                        {passenger.current_status === "Confirmed"
                                            ? <span className="text-green-400 text-xl">{passenger.current_status}</span>
                                            : <span className="text-xl">{passenger.current_status}</span>
                                        }
                                    </p>
                                    {passenger.coach &&
                                        <p><strong>Coach:</strong> <span className="text-xl">{passenger.coach}</span></p>
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }

            {showNotification && (
                <div className="fixed z-40 top-20 right-0 w-7/8 px-3 py-2 backdrop-blur-md bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-md flex items-start space-x-3">
                    <i className="fa fa-thumbs-up animate-bounce mt-1"></i>
                    <div>
                    <strong className="block font-semibold">Tip!</strong>
                    <span className="leading-[1.1]">You can test the PNR status functionality with sample data using the button below!</span>
                    </div>
                    <button 
                        onClick={() => setShowNotification(false)} 
                        className="ml-4 text-white hover:text-gray-200"
                    >
                    <i className="fa fa-times"></i>
                    </button>
                </div>
            )}
        </div>
    );
}

export default PnrStatusPage;
