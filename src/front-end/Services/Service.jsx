import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { GOOGLE_API, HOST } from "../../constants";
import { ServiceArea } from "./components/ServiceArea";
const Service = ({
    headerMenu,
    getServiceQuestion,
    serviceData,
    service,
    handleZipCodeChange,
    handleSelectZipCode,
    handleChangeQuestion,
    handleCountryCityOrStateChange,
    getProviders,
    getCountriesList,
    countriesData,
    cityCountry,
    ...props
}) => {
    const {
        match: {
            params: { subServiceId },
        },
    } = props;

    const [state, setState] = useState({
        errors: {
            notFound: "",
        },
    });
    const [zipCodes, setZipCodes] = useState();
    const [zipCodesList, setZipCodesList] = useState();
    const [googleAddress, setGoogleAddress] = useState();

    useEffect(() => {
        if (subServiceId && serviceData?.data?.id != subServiceId) {
            getServiceQuestion(subServiceId);
            getCountriesList({ sub_service_id: subServiceId });
            setGoogleAddress(null);
            setState((prevState) => ({
                ...prevState,
                errors: null,
            }));
        }
    }, [subServiceId]);

    useEffect(() => {
        if (cityCountry?.state) {
            setZipCodes(
                countriesData?.data
                    ?.find(
                        (countryData) => countryData.id == cityCountry?.country
                    )
                    ?.states?.find((state) => state.id == cityCountry?.state)
                    ?.zip_codes
            );
        }
    }, [cityCountry?.state]);

    useEffect(() => {
        setZipCodesList();
    }, [cityCountry?.state, cityCountry?.country]);

    const handleSearchZipCode = ({ target }) => {
        const data = zipCodes?.filter(({ code }) =>
            code.includes(target.value)
        );
        if (data) {
            setZipCodesList(data);
            setState((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    notFound: data?.length ? "" : "No zip code found",
                },
            }));
        }
    };

    const handleChangeZipCode = async (e) => {
        const { value } = e.target;
        handleZipCodeChange({
            target: {
                name: "address",
                value: value,
            },
        });
        showError(false);
        setGoogleAddress((prevState) => ({
            ...prevState,
            loading: true,
        }));
        await axios({
            method: "get",
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${GOOGLE_API}`,
        })
            .then(function (response) {
                if (response.data.results.length > 0) {
                    setGoogleAddress((prevState) => ({
                        ...prevState,
                        response: response.data.results,
                        errorMessage: null,
                        loading: false,
                    }));
                } else {
                    setGoogleAddress((prevState) => ({
                        ...prevState,
                        response: null,
                        errorMessage: "Not match any address",
                        loading: false,
                    }));
                }
            })
            .catch((error) => {
                setGoogleAddress((prevState) => ({
                    ...prevState,
                    response: null,
                    errorMessage: "Please Enter Valid Address",
                    loading: false,
                }));
            });
    };

    const handleSelectAddress = async (address) => {
        const { place_id, address_components, formatted_address } = address;
        const postalCode = address_components?.find((address) => {
            return address?.types?.includes("postal_code")
                ? address?.long_name
                : null;
        });
        handleZipCodeChange({
            target: {
                name: "address",
                value: formatted_address,
            },
        });

        let prms = new URLSearchParams();
        prms.append("place_id", place_id);
        prms.append("sub_service_id", subServiceId);
        service?.zip_code && prms.append("zip_code", service?.zip_code);
        // service?.vehicle_type_id &&
        //     prms.append("sub_service_id", service?.vehicle_type_id);

        await axios({
            method: "get",
            url: `${HOST}/api/user/services/check-place/${place_id}?${prms.toString()}`,
        })
            .then(function (response) {
                handleZipCodeChange({
                    target: {
                        name: "place_id",
                        value: place_id,
                    },
                    selectedZipCode: true,
                });
                !!postalCode?.long_name &&
                    handleSelectZipCode(postalCode?.long_name);
            })
            .catch((error) => {
                handleZipCodeChange({
                    target: {
                        name: "address",
                        value: "",
                    },
                });
                showError(true);
            });

        // if (postalCode?.long_name) {
        //     const data = zipCodes?.find(
        //         ({ code }) => code == postalCode?.long_name
        //     );
        //     if (data) {
        //         handleSelectZipCode(data?.code);
        //         error(false);
        //     } else {
        //         handleSelectZipCode("");
        //         error(true);
        //     }
        // } else {
        //     handleSelectZipCode("");
        //     error(true);
        // }
    };

    const showError = (isError) => {
        setState((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                notFound: isError ? "Not found provider on this location" : "",
            },
        }));
    };
    return (
        <div
            className="moving-search-box house-cleaning-sec"
            id={"services-section"}
        >
            {serviceData?.loading && (
                <div className="service-loading">
                    <i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            {!serviceData?.loading && serviceData?.error && (
                <div className="service-loading-error">
                    <i
                        className="fa fa-exclamation-triangle fa-4x fa-fw error-color"
                        aria-hidden="true"
                    ></i>
                    <span className="error-color">
                        {" "}
                        {serviceData?.message == "Not Found"
                            ? "This service is not available at the moment."
                            : serviceData?.message}
                    </span>
                </div>
            )}
            {serviceData?.data && (
                <>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            getProviders();
                        }}
                    >
                        <div className="title-move mb-5">
                            {serviceData?.data?.name}
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="m-search-left-box w-100">
                                <div className="qust-inputs-box">
                                    {serviceData?.data?.questions.map(
                                        (questionData, index, questionsData) =>
                                            index % 2 === 0 && (
                                                <Fragment key={index}>
                                                    <div className="d-flex justify-content-between">
                                                        <div className="common-input mb-4 mx-3">
                                                            <select
                                                                name={`question_${questionData.id}`}
                                                                // data-question={`question_${questionData.id}`}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const {
                                                                        name,
                                                                        value,
                                                                    } =
                                                                        e.target;
                                                                    handleChangeQuestion(
                                                                        {
                                                                            name,
                                                                            value,
                                                                        }
                                                                    );
                                                                }}
                                                                defaultValue={
                                                                    service
                                                                        .selected[
                                                                        `question_${questionData.id}`
                                                                    ]
                                                                }
                                                                required
                                                            >
                                                                <option
                                                                    // disabled={true}
                                                                    defaultValue=""
                                                                    value=""
                                                                >
                                                                    {
                                                                        questionData.question
                                                                    }
                                                                </option>
                                                                {questionData?.options.map(
                                                                    (
                                                                        optionData,
                                                                        index
                                                                    ) => (
                                                                        <Fragment
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    optionData?.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    optionData?.option
                                                                                }
                                                                            </option>
                                                                        </Fragment>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                        {questionsData[
                                                            index + 1
                                                        ] && (
                                                            <div className="common-input mb-4 mx-3">
                                                                <select
                                                                    name={`question_${
                                                                        questionsData[
                                                                            index +
                                                                                1
                                                                        ]?.id
                                                                    }`}
                                                                    // data-question={`question_${questionData.id}`}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const {
                                                                            name,
                                                                            value,
                                                                        } =
                                                                            e.target;
                                                                        handleChangeQuestion(
                                                                            {
                                                                                name,
                                                                                value,
                                                                            }
                                                                        );
                                                                    }}
                                                                    defaultValue={
                                                                        service
                                                                            .selected[
                                                                            `question_${
                                                                                questionsData[
                                                                                    index +
                                                                                        1
                                                                                ]
                                                                                    .id
                                                                            }`
                                                                        ]
                                                                    }
                                                                    required
                                                                >
                                                                    <option
                                                                        // disabled={true}
                                                                        defaultValue=""
                                                                        value=""
                                                                    >
                                                                        {
                                                                            questionsData[
                                                                                index +
                                                                                    1
                                                                            ]
                                                                                ?.question
                                                                        }
                                                                    </option>
                                                                    {questionsData[
                                                                        index +
                                                                            1
                                                                    ]?.options.map(
                                                                        (
                                                                            optionData,
                                                                            index
                                                                        ) => (
                                                                            <Fragment
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <option
                                                                                    value={
                                                                                        optionData?.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        optionData?.option
                                                                                    }
                                                                                </option>
                                                                            </Fragment>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Fragment>
                                            )
                                    )}
                                </div>
                                {/* <hr /> */}
                                {/* <h4 className="mx-3 my-1">
                                    Choose service area
                                </h4>
                                <div className="d-flex justify-content-between">
                                    <ServiceArea
                                        {...{
                                            countriesData: countriesData?.data,
                                            cityCountry,
                                            handleCountryCityOrStateChange,
                                            extraClasses: "mx-3",
                                        }}
                                    />
                                </div> */}
                                <div
                                    className="col-md-12 text-dark mb-2"
                                    style={{ fontSize: "1.5rem" }}
                                >
                                    Service area
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="common-input mb-2 mx-3 rem-1-5">
                                        <input
                                            // disabled={!cityCountry?.state}
                                            type="text"
                                            onChange={handleChangeZipCode}
                                            name="zipCode"
                                            value={service?.address}
                                            placeholder="Enter location"
                                        />
                                        {googleAddress?.loading && (
                                            <>
                                                <i className="fa fa-spinner fa-pulse"></i>{" "}
                                                Loading...
                                            </>
                                        )}
                                        {!service?.selectedZipCode &&
                                            googleAddress?.response?.length >
                                                0 &&
                                            googleAddress?.response?.map(
                                                (address, index) => (
                                                    <div
                                                        className="text-dark mt-2 mb-2"
                                                        onClick={() =>
                                                            handleSelectAddress(
                                                                address
                                                            )
                                                        }
                                                        role="button"
                                                        key={index}
                                                    >
                                                        {
                                                            address.formatted_address
                                                        }
                                                    </div>
                                                )
                                            )}
                                        {(() => {
                                            if (googleAddress?.errorMessage)
                                                return (
                                                    <div className="text-danger mt-2 mb-2">
                                                        {
                                                            googleAddress?.errorMessage
                                                        }
                                                    </div>
                                                );
                                            else if (googleAddress?.loading)
                                                return (
                                                    <div className="text-dark mt-2 mb-2">
                                                        Loading...
                                                    </div>
                                                );
                                            else if (state?.errors?.notFound)
                                                return (
                                                    <div className="text-danger mt-2 mb-2">
                                                        {
                                                            state?.errors
                                                                ?.notFound
                                                        }
                                                    </div>
                                                );
                                            else if (state?.zipCodeErr)
                                                return (
                                                    <div className="text-danger mt-2 mb-2">
                                                        {state?.zipCodeErr}
                                                    </div>
                                                );
                                            else return null;
                                        })()}
                                    </div>
                                </div>
                                {/* <div className=""> */}
                                {/* {!!zipCodesList?.length ? (
                                    service?.selectedZipCode == false && (
                                        <>
                                            <center
                                                className="col-md-12 text-dark mb-1 mt-1"
                                                style={{
                                                    fontSize: "1.5rem",
                                                }}
                                            >
                                                Please Select Zip Code
                                            </center>
                                            {zipCodesList?.map(
                                                (data, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-dark mb-1 mx-3 mt-1 p-1"
                                                        style={{
                                                            fontSize: "1.5rem",
                                                            border: "1px solid #F1F2F7",
                                                            backgroundColor:
                                                                "#F1F2F7",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                        data-code={data?.code}
                                                        onClick={() =>
                                                            handleSelectZipCode(
                                                                data?.code
                                                            )
                                                        }
                                                    >
                                                        {data?.code}
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )
                                ) : (
                                    <></>
                                )} */}
                                {/* <strong className="col-md-12 text-danger">
                                    {state?.errors?.notFound}
                                </strong> */}
                                {/* {service?.zipCodeErr} */}
                                {/* </div> */}
                            </div>
                        </div>
                        <div className="text-center mt-0 mx-3">
                            <button
                                type="submit"
                                className="button-common mt-5 w-100"
                                disabled={(() => {
                                    let isDisabled = false;
                                    serviceData?.data?.questions.filter(
                                        (question) => {
                                            if (
                                                service.selected[
                                                    `question_${question.id}`
                                                ] === "" ||
                                                service.selected[
                                                    `question_${question.id}`
                                                ] === undefined
                                            ) {
                                                isDisabled = true;
                                                return true;
                                            }
                                            return false;
                                        }
                                    );
                                    if (
                                        (service.zipCode === "" &&
                                            service?.place_id == "") ||
                                        service?.selectedZipCode == false
                                    ) {
                                        isDisabled = true;
                                    }


                                    return isDisabled;
                                })()}
                            >
                                Get Providers
                            </button>
                        </div>
                    </form>
                    <div className="moving-des mt-5">
                        {serviceData?.data?.service_requests.length > 0 && (
                            <>
                                <div className="title">We recommend you!</div>
                                <ul className="time-list d-flex align-items-center justify-content-center flex-wrap recommend-times">
                                    {serviceData?.data?.service_requests?.map(
                                        (service, index) =>
                                            index <= 6 && (
                                                <li
                                                    key={index}
                                                    className="cursor-default d-flex align-items-center justify-content-center"
                                                >
                                                    {service?.hours == 1
                                                        ? `${service?.hours} hour`
                                                        : `${service?.hours} hours`}
                                                </li>
                                            )
                                    )}
                                </ul>
                            </>
                        )}
                        <p className="text-center">
                            {serviceData?.data?.terms}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export { Service };