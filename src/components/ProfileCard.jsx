import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { changeImage, initialState } from "./../store/Slices/UserSlice";
import { HOST } from "../constants";

const ProfileCard = ({ profile }) => {
    const dispatch = useDispatch();
    const imgLoading = useRef(null);
    const imageUpdate = useSelector((state) => state.userReducer.imageUpdate);

    useEffect(() => {
        return () => {
            dispatch(initialState("imageUpdate"));
        };
    }, []);

    useEffect(() => {
        console.log("====================================");
        console.log(imageUpdate);
        console.log("====================================");
        if (imageUpdate?.loading) {
            imgLoading.current = toast.info("updating profile Image", {
                autoClose: false,
            });
            console.log(imgLoading.current);
            return true;
        }

        if (imageUpdate?.error == false) {
            toast.dismiss(imgLoading.current);
            toast.success("Image updated successfully");
            return true;
        }

        if (imageUpdate?.error) {
            toast.dismiss(imgLoading.current);
            toast.error(profile?.imageUpdate?.message);
            return true;
        }
    }, [imageUpdate]);
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            let formData = new FormData();
            formData.append("image", e.target.files[0]);
            formData.append("_method", "PATCH");
            dispatch(changeImage(formData));
        }
    };
    return (
        <div className="profile-info service-time-box text-center mt-5 mb-5 h-auto mx-auto">
            {profile?.loading ? (
                <>
                    <i className="fa fa-spinner fa-pulse fa-5x fa-fw m-5"></i>
                    <span className="sr-only">Loading...</span>
                </>
            ) : (
                <>
                    <div className="pro-pic">
                        <img
                            src={
                                HOST + profile?.image || "/assets/img/user4.jpg"
                            }
                            className="img-fluid"
                            alt=""
                        />
                        <input
                            type="file"
                            id="image"
                            className="d-none"
                            onChange={handleImageChange}
                        ></input>
                        <label
                            className="fa fa-camera-retro fa-3x"
                            style={{
                                backgroundColor: "white",
                                border: "3px solid #000000000",
                                borderRadius: "50%",
                                position: "absolute",
                                zIndex: "1",
                                top: "30%",
                                right: "27%",
                            }}
                            htmlFor="image"
                        ></label>
                    </div>
                    <div className="pro-title">{profile?.name || "Name"}</div>
                    <div className="pro-price">
                        {profile?.sub_title || "BASIC"}
                    </div>
                    <div className="pro-jos-status">4</div>
                    {<Rating rating={profile?.rating || 0} />}
                </>
            )}
        </div>
    );
};

export default ProfileCard;
