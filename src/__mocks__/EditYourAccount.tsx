import React, { useEffect, useState } from "react"
import "../user-management-page/StudentManagement/StudentDashStyles.scss"
import Input from "../../components/input-textarea/input"
import DatePicker from "../../components/datepicker/datepicker"
import DropdownSelect from "../../components/dropdown-select/dropdown-select"
import { useSelector } from "react-redux"
import { StoreState } from "../../redux/reducers"
import { updateUser } from "../../api-client/apiModules/user"
import EditProfileModal from "./EditProfileModal"
import dayjs from "dayjs"
import Textarea from "../../components/input-textarea/textarea"
import OnboardingDialog from "./OnboardingDialog"
import { getUserById } from "../../api-client/apiModules/admin"

export function EditYourAccount() {
  const person = useSelector((state: StoreState) => state.user)
  const [firstname, setFirstname] = useState(person.displayName.split(" ")[0])
  const [lastname, setLastname] = useState(person.displayName.split(" ")[1])
  const [phoneNumber, setPhoneNumber] = useState(person.phoneNumber || "")
  const [linkedinURL, setLinkedinURL] = useState(person.linkedinURL || "")
  const [dob, setDob] = useState(
    person.dateOfBirth ? new Date(person.dateOfBirth) : new Date(),
  )
  const [address, setAddress] = useState(person.address?.streetAddress || "")
  const [city, setCity] = useState(person.address?.city || "")
  const [state, setState] = useState(person.address?.state || "")
  const [zipCode, setZipCode] = useState(person.address?.zipCode || "")
  const [phoneNumberError, setPhoneNumberError] = useState(false)
  const [linkedinURLError, setLinkedinURLError] = useState(false)
  const [addressError, setAddressError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [stateError, setStateError] = useState(false)
  const [zipCodeError, setZipCodeError] = useState(false)
  const [firstnameError, setFirstnameError] = useState(false)
  const [lastnameError, setLastnameError] = useState(false)
  const [startDate, setStartDate] = useState(
    person.startDate ? new Date(person.startDate) : new Date(),
  )
  const [startDateError, setStartDateError] = useState(false)
  const [programNameError, setProgramNameError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [onboardingDialog, setOnboardingDialog] = useState(
    !person.onboarding.initial,
  )
  const [currentCoach, setCurrentCoach] = useState({
    firstName: "",
    lastName: "",
    id: "",
  })
  const [coachDropdownValues, setCoachDropdownValues] = useState([])

  const errorMessage = "This field is required"

  const defaultUserPhotoURL =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000"

  const stateOptions = [
    { name: "Alabama", value: "AL" },
    { name: "Alaska", value: "AK" },
    { name: "Arizona", value: "AZ" },
    { name: "Arkansas", value: "AR" },
    { name: "California", value: "CA" },
    { name: "Colorado", value: "CO" },
    { name: "Connecticut", value: "CT" },
    { name: "Delaware", value: "DE" },
    { name: "Florida", value: "FL" },
    { name: "Georgia", value: "GA" },
    { name: "Hawaii", value: "HI" },
    { name: "Idaho", value: "ID" },
    { name: "Illinois", value: "IL" },
    { name: "Indiana", value: "IN" },
    { name: "Iowa", value: "IA" },
    { name: "Kansas", value: "KS" },
    { name: "Kentucky", value: "KY" },
    { name: "Louisiana", value: "LA" },
    { name: "Maine", value: "ME" },
    { name: "Maryland", value: "MD" },
    { name: "Massachusetts", value: "MA" },
    { name: "Michigan", value: "MI" },
    { name: "Minnesota", value: "MN" },
    { name: "Mississippi", value: "MS" },
    { name: "Missouri", value: "MO" },
    { name: "Montana", value: "MT" },
    { name: "Nebraska", value: "NE" },
    { name: "Nevada", value: "NV" },
    { name: "New Hampshire", value: "NH" },
    { name: "New Jersey", value: "NJ" },
    { name: "New Mexico", value: "NM" },
    { name: "New York", value: "NY" },
    { name: "North Carolina", value: "NC" },
    { name: "North Dakota", value: "ND" },
    { name: "Ohio", value: "OH" },
    { name: "Oklahoma", value: "OK" },
    { name: "Oregon", value: "OR" },
    { name: "Pennsylvania", value: "PA" },
    { name: "Rhode Island", value: "RI" },
    { name: "South Carolina", value: "SC" },
    { name: "South Dakota", value: "SD" },
    { name: "Tennessee", value: "TN" },
    { name: "Texas", value: "TX" },
    { name: "Utah", value: "UT" },
    { name: "Vermont", value: "VT" },
    { name: "Virginia", value: "VA" },
    { name: "Washington", value: "WA" },
    { name: "West Virginia", value: "WV" },
    { name: "Wisconsin", value: "WI" },
    { name: "Wyoming", value: "WY" },
  ]

  const updateUserData = async () => {
    try {
      setModalOpen(false)
      if (phoneNumber === "") {
        setPhoneNumberError(true)
        return
      } else if (linkedinURL === "") {
        setLinkedinURLError(true)
        return
      } else if (address === "") {
        setAddressError(true)
        return
      } else if (city === "") {
        setCityError(true)
        return
      } else if (state === "") {
        setStateError(true)
        return
      } else if (zipCode === "") {
        setZipCodeError(true)
        return
      } else if (firstname === "") {
        setFirstnameError(true)
        return
      } else if (lastname === "") {
        setLastnameError(true)
        return
      }
      const route = person.onboarding.initial ? "profile" : ""
      await updateUser({
        address: {
          streetAddress: address,
          city,
          state,
          zipCode,
        },
        phoneNumber,
        linkedinURL,
        dateOfBirth: dob,
        firstName: firstname,
        lastName: lastname,
        onboarding: {
          initial: true,
          preferences: false,
          resume: false,
          settings: false,
        },
      })
      setModalOpen(false)
      window.location.replace(`${window.location.origin}/${route}`)
    } catch (e) {
      console.log(e, " error updating user")
      alert(
        "There was an error updating your account.  Please contact support.",
      )
    }
  }

  const cancelButtonClick = () => {
    if (
      address !== person.address?.streetAddress ||
      city !== person.address?.city ||
      state !== person.address?.state ||
      zipCode !== person.address?.zipCode ||
      phoneNumber !== person.phoneNumber ||
      linkedinURL !== person.linkedinURL ||
      dayjs(dob).format("MM/DD/YYYY") !==
        dayjs(person.dateOfBirth).format("MM/DD/YYYY")
    ) {
      setModalOpen(true)
    } else {
      window.location.replace(`${window.location.origin}/profile`)
    }
  }

  const doNotSaveButtonClick = () => {
    setModalOpen(false)
    window.location.replace(`${window.location.origin}/profile`)
  }

  const formatPhoneNumber = (phoneNumberString: string) => {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "")
    if (cleaned.length <= 3) {
      setPhoneNumber(cleaned)
    } else if (cleaned.length <= 6) {
      setPhoneNumber(cleaned.slice(0, 3) + "-" + cleaned.slice(3))
    } else {
      setPhoneNumber(
        cleaned.slice(0, 3) +
          "-" +
          cleaned.slice(3, 6) +
          "-" +
          cleaned.slice(6),
      )
    }
  }

  useEffect(() => {
    const findCoach = async () => {
      if (!person.cohortInfo?.coach) {
        setCoachDropdownValues([
          {
            name: "TBD",
            value: "TBD",
          },
        ])
        return
      }
      const response = await getUserById(person.cohortInfo.coach)
      setCoachDropdownValues([
        {
          name: `${response.firstName} ${response.lastName}`,
          value: person.cohortInfo.coach,
        },
      ])
      setCurrentCoach(response)
    }
    findCoach()
  }, [])

  return (
    <section className="mb-20 flex w-full justify-center px-7 pt-6">
      {modalOpen ? (
        <EditProfileModal
          open={modalOpen}
          setOpen={setModalOpen}
          onSaveButtonClick={updateUserData}
          doNotSaveButtonClick={doNotSaveButtonClick}
        />
      ) : null}
      {onboardingDialog ? (
        <OnboardingDialog
          open={onboardingDialog}
          setOpen={setOnboardingDialog}
          institutionName={person.groupInfo.name}
        />
      ) : null}
      <div
        className="w-full overflow-hidden rounded-lg bg-white px-4 pb-10 pt-6 shadow"
        style={{ maxWidth: "960px" }}
      >
        <div className="student-header-wrapper flex sm:flex-auto">
          <div className="flex w-full justify-center">
            <img
              className="h-20 w-20 rounded-full"
              src={person.photoURL || defaultUserPhotoURL}
              referrerPolicy="no-referrer"
              alt=""
            ></img>
          </div>
        </div>

        <form>
          <p className="text-lg font-bold not-italic leading-6">
            Personal Information
          </p>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
            <div className="pt-4 sm:col-span-3 md:pt-4">
              {/* <label
                htmlFor="first-name"
                className="block  font-medium leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  placeholder="First Name"
                  className="block w-full rounded-md py-1.5"
                />
              </div> */}
              <Input
                label="First name"
                name="First name"
                placeholder="First name"
                value={firstname}
                disabled={person.onboarding.initial}
                onChange={(e) => setFirstname(e.target.value)}
                error={firstnameError}
                errorMessage={errorMessage}
              />
            </div>

            <div className="pt-4 sm:col-span-3 md:pt-4">
              {/* <label
                htmlFor="last-name"
                className="block  font-medium leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  placeholder="Last Name"
                  className="block w-full rounded-md py-1.5"
                />
              </div> */}
              <Input
                label="Last name"
                name="Last name"
                placeholder="Last name"
                value={lastname}
                disabled={person.onboarding.initial}
                onChange={(e) => setLastname(e.target.value)}
                error={lastnameError}
                errorMessage={errorMessage}
              />
            </div>
            {person.onboarding.initial ? (
              <p className="pt-4 sm:col-span-6">
                If you want your name changed, please contact an administrator.
              </p>
            ) : null}
            <div className="pt-10 sm:col-span-3">
              {/* <label
                htmlFor="Email"
                className="block  font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.63249 2.5H14.368C15.0388 2.49999 15.5924 2.49998 16.0434 2.53683C16.5118 2.5751 16.9424 2.65724 17.3469 2.86331C17.9741 3.18289 18.484 3.69283 18.8036 4.32003C19.0025 4.71032 19.0859 5.12495 19.1259 5.57442C19.1704 5.71059 19.1783 5.85421 19.1518 5.99133C19.1669 6.36643 19.1669 6.80029 19.1669 7.2989V12.7011C19.1669 13.3719 19.1669 13.9255 19.1301 14.3765C19.0918 14.8449 19.0097 15.2755 18.8036 15.68C18.484 16.3072 17.9741 16.8171 17.3469 17.1367C16.9424 17.3428 16.5118 17.4249 16.0434 17.4632C15.5924 17.5 15.0388 17.5 14.368 17.5H5.63246C4.96167 17.5 4.40804 17.5 3.95705 17.4632C3.48863 17.4249 3.05805 17.3428 2.6536 17.1367C2.02639 16.8171 1.51646 16.3072 1.19688 15.68C0.990804 15.2755 0.908667 14.8449 0.870396 14.3765C0.833548 13.9255 0.833557 13.3719 0.833567 12.7011V7.29892C0.833559 6.80031 0.833552 6.36643 0.848682 5.99133C0.822218 5.85421 0.830029 5.71058 0.874581 5.57441C0.914571 5.12494 0.998019 4.71032 1.19688 4.32003C1.51646 3.69283 2.02639 3.18289 2.6536 2.86331C3.05805 2.65724 3.48863 2.5751 3.95705 2.53683C4.40804 2.49998 4.96168 2.49999 5.63249 2.5ZM2.50023 7.43388V12.6667C2.50023 13.3805 2.50088 13.8657 2.53153 14.2408C2.56138 14.6061 2.61548 14.793 2.68189 14.9233C2.84168 15.2369 3.09665 15.4919 3.41025 15.6517C3.54058 15.7181 3.72742 15.7722 4.09277 15.802C4.46784 15.8327 4.95308 15.8333 5.6669 15.8333H14.3336C15.0474 15.8333 15.5326 15.8327 15.9077 15.802C16.273 15.7722 16.4599 15.7181 16.5902 15.6517C16.9038 15.4919 17.1588 15.2369 17.3186 14.9233C17.385 14.793 17.4391 14.6061 17.4689 14.2408C17.4996 13.8657 17.5002 13.3805 17.5002 12.6667V7.43388L12.0074 11.2789C11.975 11.3015 11.943 11.324 11.9112 11.3463C11.4574 11.665 11.0588 11.9449 10.6049 12.058C10.2079 12.157 9.7926 12.157 9.39557 12.058C8.94166 11.9449 8.54312 11.665 8.08924 11.3463C8.05748 11.324 8.02545 11.3015 7.99311 11.2789L2.50023 7.43388ZM17.4313 5.44774L11.0516 9.91351C10.4441 10.3387 10.3154 10.4125 10.2018 10.4408C10.0694 10.4738 9.93102 10.4738 9.79868 10.4408C9.68503 10.4125 9.55634 10.3387 8.94889 9.91351L2.56921 5.44774C2.59898 5.2751 2.63771 5.16339 2.68189 5.07668C2.84168 4.76308 3.09665 4.50811 3.41025 4.34832C3.54058 4.28192 3.72742 4.22781 4.09277 4.19796C4.46784 4.16732 4.95308 4.16667 5.6669 4.16667H14.3336C15.0474 4.16667 15.5326 4.16732 15.9077 4.19796C16.273 4.22781 16.4599 4.28192 16.5902 4.34832C16.9038 4.50811 17.1588 4.76308 17.3186 5.07668C17.3628 5.16339 17.4015 5.2751 17.4313 5.44774Z"
                      fill="#0F0E12"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="name@domain.com"
                  className="block w-full rounded-md py-1.5 pl-10"
                />
              </div> */}
              <Input
                label="Email"
                name="Email"
                placeholder="@gmail.com"
                value={person.email}
                disabled={true}
                svgIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.63249 2.5H14.368C15.0388 2.49999 15.5924 2.49998 16.0434 2.53683C16.5118 2.5751 16.9424 2.65724 17.3469 2.86331C17.9741 3.18289 18.484 3.69283 18.8036 4.32003C19.0025 4.71032 19.0859 5.12495 19.1259 5.57442C19.1704 5.71059 19.1783 5.85421 19.1518 5.99133C19.1669 6.36643 19.1669 6.80029 19.1669 7.2989V12.7011C19.1669 13.3719 19.1669 13.9255 19.1301 14.3765C19.0918 14.8449 19.0097 15.2755 18.8036 15.68C18.484 16.3072 17.9741 16.8171 17.3469 17.1367C16.9424 17.3428 16.5118 17.4249 16.0434 17.4632C15.5924 17.5 15.0388 17.5 14.368 17.5H5.63246C4.96167 17.5 4.40804 17.5 3.95705 17.4632C3.48863 17.4249 3.05805 17.3428 2.6536 17.1367C2.02639 16.8171 1.51646 16.3072 1.19688 15.68C0.990804 15.2755 0.908667 14.8449 0.870396 14.3765C0.833548 13.9255 0.833557 13.3719 0.833567 12.7011V7.29892C0.833559 6.80031 0.833552 6.36643 0.848682 5.99133C0.822218 5.85421 0.830029 5.71058 0.874581 5.57441C0.914571 5.12494 0.998019 4.71032 1.19688 4.32003C1.51646 3.69283 2.02639 3.18289 2.6536 2.86331C3.05805 2.65724 3.48863 2.5751 3.95705 2.53683C4.40804 2.49998 4.96168 2.49999 5.63249 2.5ZM2.50023 7.43388V12.6667C2.50023 13.3805 2.50088 13.8657 2.53153 14.2408C2.56138 14.6061 2.61548 14.793 2.68189 14.9233C2.84168 15.2369 3.09665 15.4919 3.41025 15.6517C3.54058 15.7181 3.72742 15.7722 4.09277 15.802C4.46784 15.8327 4.95308 15.8333 5.6669 15.8333H14.3336C15.0474 15.8333 15.5326 15.8327 15.9077 15.802C16.273 15.7722 16.4599 15.7181 16.5902 15.6517C16.9038 15.4919 17.1588 15.2369 17.3186 14.9233C17.385 14.793 17.4391 14.6061 17.4689 14.2408C17.4996 13.8657 17.5002 13.3805 17.5002 12.6667V7.43388L12.0074 11.2789C11.975 11.3015 11.943 11.324 11.9112 11.3463C11.4574 11.665 11.0588 11.9449 10.6049 12.058C10.2079 12.157 9.7926 12.157 9.39557 12.058C8.94166 11.9449 8.54312 11.665 8.08924 11.3463C8.05748 11.324 8.02545 11.3015 7.99311 11.2789L2.50023 7.43388ZM17.4313 5.44774L11.0516 9.91351C10.4441 10.3387 10.3154 10.4125 10.2018 10.4408C10.0694 10.4738 9.93102 10.4738 9.79868 10.4408C9.68503 10.4125 9.55634 10.3387 8.94889 9.91351L2.56921 5.44774C2.59898 5.2751 2.63771 5.16339 2.68189 5.07668C2.84168 4.76308 3.09665 4.50811 3.41025 4.34832C3.54058 4.28192 3.72742 4.22781 4.09277 4.19796C4.46784 4.16732 4.95308 4.16667 5.6669 4.16667H14.3336C15.0474 4.16667 15.5326 4.16732 15.9077 4.19796C16.273 4.22781 16.4599 4.28192 16.5902 4.34832C16.9038 4.50811 17.1588 4.76308 17.3186 5.07668C17.3628 5.16339 17.4015 5.2751 17.4313 5.44774Z"
                      fill="#B6B3C6"
                    />
                  </svg>
                }
              />
            </div>
            <div className="pt-10 sm:col-span-3">
              {/* <label
                htmlFor="Phone"
                className="block  font-medium leading-6 text-gray-900"
              >
                Phone
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.75402 3.05185C5.51754 2.93224 5.23826 2.93223 5.00177 3.05185C4.91284 3.09683 4.80197 3.19288 4.31279 3.68207L4.18142 3.81343C3.71458 4.28028 3.58874 4.4153 3.48815 4.59437C3.37155 4.80192 3.27387 5.17754 3.27458 5.4156C3.27521 5.62744 3.30648 5.75501 3.4442 6.24022C4.12387 8.63486 5.40604 10.8947 7.29298 12.7816C9.17991 14.6686 11.4397 15.9507 13.8344 16.6304C14.3196 16.7681 14.4472 16.7994 14.659 16.8C14.8971 16.8007 15.2727 16.703 15.4802 16.5864C15.6593 16.4859 15.7943 16.36 16.2612 15.8932L16.3925 15.7618C16.8817 15.2726 16.9778 15.1618 17.0227 15.0728C17.1424 14.8363 17.1424 14.5571 17.0227 14.3206C16.9778 14.2316 16.8817 14.1208 16.3925 13.6316L16.9818 13.0423L16.3925 13.6316L16.2301 13.4692C15.9087 13.1478 15.8364 13.082 15.7817 13.0463C15.5055 12.8668 15.1494 12.8668 14.8732 13.0463C14.8184 13.082 14.7461 13.1478 14.4247 13.4692C14.4184 13.4755 14.4118 13.4821 14.4052 13.4888C14.3304 13.5638 14.2357 13.6588 14.122 13.7402L13.6369 13.0627L14.122 13.7402C13.7162 14.0308 13.1645 14.1249 12.6853 13.9852C12.5516 13.9463 12.4416 13.8932 12.3561 13.852C12.3493 13.8487 12.3427 13.8455 12.3362 13.8424C11.0446 13.2223 9.83485 12.3772 8.76612 11.3085C7.69739 10.2397 6.85231 9.03001 6.23217 7.73838C6.22906 7.73191 6.22588 7.7253 6.22261 7.71853C6.18136 7.63295 6.12833 7.52295 6.08937 7.3893L6.8894 7.15609L6.08937 7.3893C5.94968 6.9101 6.04376 6.35839 6.33435 5.95256L6.33435 5.95256C6.41577 5.83886 6.51078 5.74419 6.58584 5.66941C6.59252 5.66274 6.59905 5.65624 6.6054 5.6499C6.92682 5.32847 6.99263 5.2562 7.02825 5.20142L7.02825 5.20142C7.20783 4.92522 7.20783 4.56914 7.02825 4.29294C6.99263 4.23816 6.92682 4.16588 6.6054 3.84446L6.44301 3.68207C5.95382 3.19288 5.84295 3.09683 5.75402 3.05185ZM4.24953 1.5646C4.95898 1.20576 5.79681 1.20576 6.50626 1.5646C6.86676 1.74694 7.17972 2.0607 7.54175 2.42366C7.56807 2.45004 7.59464 2.47669 7.62152 2.50356L7.78391 2.66595C7.80161 2.68365 7.81915 2.70117 7.83652 2.7185C8.07541 2.95698 8.28118 3.16241 8.42555 3.38445L7.7269 3.83869L8.42555 3.38445C8.96429 4.21306 8.96429 5.28129 8.42554 6.10991C8.28118 6.33195 8.0754 6.53737 7.83652 6.77585C7.81916 6.79319 7.80161 6.8107 7.78391 6.82841C7.7359 6.87641 7.71141 6.90103 7.69435 6.91908C7.69404 6.92044 7.69374 6.92194 7.69346 6.92356C7.69315 6.92537 7.69293 6.92704 7.69276 6.92855C7.69551 6.93464 7.69923 6.9427 7.70435 6.95359C7.71236 6.97061 7.72177 6.99022 7.73463 7.01701C8.27449 8.14141 9.01073 9.19607 9.94463 10.13C10.8785 11.0639 11.9332 11.8001 13.0576 12.34L12.6969 13.0912L13.0576 12.34C13.0844 12.3528 13.104 12.3622 13.121 12.3702C13.1319 12.3754 13.14 12.3791 13.146 12.3818C13.1476 12.3817 13.1492 12.3814 13.151 12.3811C13.1527 12.3809 13.1542 12.3806 13.1555 12.3802C13.1736 12.3632 13.1982 12.3387 13.2462 12.2907C13.2639 12.273 13.2814 12.2554 13.2988 12.2381C13.5372 11.9992 13.7427 11.7934 13.9647 11.6491C14.7933 11.1103 15.8615 11.1103 16.6901 11.6491C16.9122 11.7934 17.1176 11.9992 17.3561 12.2381C17.3734 12.2554 17.3909 12.273 17.4086 12.2907L16.8194 12.8799L17.4087 12.2907L17.571 12.4531C17.5979 12.4799 17.6245 12.5065 17.6509 12.5328C18.0139 12.8949 18.3277 13.2078 18.51 13.5683C18.8688 14.2778 18.8688 15.1156 18.51 15.8251C18.3277 16.1856 18.0139 16.4985 17.6509 16.8606C17.6245 16.8869 17.5979 16.9135 17.571 16.9403L17.4397 17.0717C17.4206 17.0907 17.4019 17.1095 17.3833 17.1281C16.9955 17.5162 16.6982 17.8139 16.2965 18.0395C15.8382 18.297 15.1797 18.4682 14.654 18.4667C14.1941 18.4653 13.8587 18.37 13.4262 18.2471C13.4107 18.2427 13.3951 18.2382 13.3793 18.2337C10.7183 17.4785 8.20749 16.0532 6.11446 13.9601C4.02143 11.8671 2.59614 9.35632 1.84087 6.6953C1.83639 6.67952 1.83194 6.66388 1.82753 6.64836C1.70461 6.21586 1.60929 5.88047 1.60792 5.42056C1.60636 4.89492 1.77761 4.23638 2.03505 3.7781L2.03505 3.77809C2.26072 3.37637 2.55835 3.07905 2.94646 2.69134C2.96507 2.67275 2.98388 2.65395 3.00291 2.63492L3.13427 2.50356C3.16115 2.47669 3.18772 2.45004 3.21404 2.42366C3.57607 2.0607 3.88903 1.74694 4.24953 1.5646L4.62139 2.2998L4.24953 1.5646Z"
                      fill="#0F0E12"
                    />
                  </svg>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="555-555-5555"
                  className="block w-full rounded-md py-1.5 pl-10"
                />
              </div> */}
              <Input
                label="Phone"
                name="Phone"
                placeholder="_ _ _ - _ _ _ - _ _ _ _"
                maxLength={12}
                value={phoneNumber}
                onChange={(e) => formatPhoneNumber(e.target.value)}
                onInput={(e) => setPhoneNumberError(false)}
                error={phoneNumberError}
                errorMessage={errorMessage}
                svgIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.75402 3.05185C5.51754 2.93224 5.23826 2.93223 5.00177 3.05185C4.91284 3.09683 4.80197 3.19288 4.31279 3.68207L4.18142 3.81343C3.71458 4.28028 3.58874 4.4153 3.48815 4.59437C3.37155 4.80192 3.27387 5.17754 3.27458 5.4156C3.27521 5.62744 3.30648 5.75501 3.4442 6.24022C4.12387 8.63486 5.40604 10.8947 7.29298 12.7816C9.17991 14.6686 11.4397 15.9507 13.8344 16.6304C14.3196 16.7681 14.4472 16.7994 14.659 16.8C14.8971 16.8007 15.2727 16.703 15.4802 16.5864C15.6593 16.4859 15.7943 16.36 16.2612 15.8932L16.3925 15.7618C16.8817 15.2726 16.9778 15.1618 17.0227 15.0728C17.1424 14.8363 17.1424 14.5571 17.0227 14.3206C16.9778 14.2316 16.8817 14.1208 16.3925 13.6316L16.9818 13.0423L16.3925 13.6316L16.2301 13.4692C15.9087 13.1478 15.8364 13.082 15.7817 13.0463C15.5055 12.8668 15.1494 12.8668 14.8732 13.0463C14.8184 13.082 14.7461 13.1478 14.4247 13.4692C14.4184 13.4755 14.4118 13.4821 14.4052 13.4888C14.3304 13.5638 14.2357 13.6588 14.122 13.7402L13.6369 13.0627L14.122 13.7402C13.7162 14.0308 13.1645 14.1249 12.6853 13.9852C12.5516 13.9463 12.4416 13.8932 12.3561 13.852C12.3493 13.8487 12.3427 13.8455 12.3362 13.8424C11.0446 13.2223 9.83485 12.3772 8.76612 11.3085C7.69739 10.2397 6.85231 9.03001 6.23217 7.73838C6.22906 7.73191 6.22588 7.7253 6.22261 7.71853C6.18136 7.63295 6.12833 7.52295 6.08937 7.3893L6.8894 7.15609L6.08937 7.3893C5.94968 6.9101 6.04376 6.35839 6.33435 5.95256L6.33435 5.95256C6.41577 5.83886 6.51078 5.74419 6.58584 5.66941C6.59252 5.66274 6.59905 5.65624 6.6054 5.6499C6.92682 5.32847 6.99263 5.2562 7.02825 5.20142L7.02825 5.20142C7.20783 4.92522 7.20783 4.56914 7.02825 4.29294C6.99263 4.23816 6.92682 4.16588 6.6054 3.84446L6.44301 3.68207C5.95382 3.19288 5.84295 3.09683 5.75402 3.05185ZM4.24953 1.5646C4.95898 1.20576 5.79681 1.20576 6.50626 1.5646C6.86676 1.74694 7.17972 2.0607 7.54175 2.42366C7.56807 2.45004 7.59464 2.47669 7.62152 2.50356L7.78391 2.66595C7.80161 2.68365 7.81915 2.70117 7.83652 2.7185C8.07541 2.95698 8.28118 3.16241 8.42555 3.38445L7.7269 3.83869L8.42555 3.38445C8.96429 4.21306 8.96429 5.28129 8.42554 6.10991C8.28118 6.33195 8.0754 6.53737 7.83652 6.77585C7.81916 6.79319 7.80161 6.8107 7.78391 6.82841C7.7359 6.87641 7.71141 6.90103 7.69435 6.91908C7.69404 6.92044 7.69374 6.92194 7.69346 6.92356C7.69315 6.92537 7.69293 6.92704 7.69276 6.92855C7.69551 6.93464 7.69923 6.9427 7.70435 6.95359C7.71236 6.97061 7.72177 6.99022 7.73463 7.01701C8.27449 8.14141 9.01073 9.19607 9.94463 10.13C10.8785 11.0639 11.9332 11.8001 13.0576 12.34L12.6969 13.0912L13.0576 12.34C13.0844 12.3528 13.104 12.3622 13.121 12.3702C13.1319 12.3754 13.14 12.3791 13.146 12.3818C13.1476 12.3817 13.1492 12.3814 13.151 12.3811C13.1527 12.3809 13.1542 12.3806 13.1555 12.3802C13.1736 12.3632 13.1982 12.3387 13.2462 12.2907C13.2639 12.273 13.2814 12.2554 13.2988 12.2381C13.5372 11.9992 13.7427 11.7934 13.9647 11.6491C14.7933 11.1103 15.8615 11.1103 16.6901 11.6491C16.9122 11.7934 17.1176 11.9992 17.3561 12.2381C17.3734 12.2554 17.3909 12.273 17.4086 12.2907L16.8194 12.8799L17.4087 12.2907L17.571 12.4531C17.5979 12.4799 17.6245 12.5065 17.6509 12.5328C18.0139 12.8949 18.3277 13.2078 18.51 13.5683C18.8688 14.2778 18.8688 15.1156 18.51 15.8251C18.3277 16.1856 18.0139 16.4985 17.6509 16.8606C17.6245 16.8869 17.5979 16.9135 17.571 16.9403L17.4397 17.0717C17.4206 17.0907 17.4019 17.1095 17.3833 17.1281C16.9955 17.5162 16.6982 17.8139 16.2965 18.0395C15.8382 18.297 15.1797 18.4682 14.654 18.4667C14.1941 18.4653 13.8587 18.37 13.4262 18.2471C13.4107 18.2427 13.3951 18.2382 13.3793 18.2337C10.7183 17.4785 8.20749 16.0532 6.11446 13.9601C4.02143 11.8671 2.59614 9.35632 1.84087 6.6953C1.83639 6.67952 1.83194 6.66388 1.82753 6.64836C1.70461 6.21586 1.60929 5.88047 1.60792 5.42056C1.60636 4.89492 1.77761 4.23638 2.03505 3.7781L2.03505 3.77809C2.26072 3.37637 2.55835 3.07905 2.94646 2.69134C2.96507 2.67275 2.98388 2.65395 3.00291 2.63492L3.13427 2.50356C3.16115 2.47669 3.18772 2.45004 3.21404 2.42366C3.57607 2.0607 3.88903 1.74694 4.24953 1.5646L4.62139 2.2998L4.24953 1.5646Z"
                      fill="#0F0E12"
                    />
                  </svg>
                }
              />
            </div>
            <div className="pt-10 sm:col-span-3">
              <label
                htmlFor="DOB"
                className="mb-1 block font-medium leading-6 text-gray-900"
              >
                Date of birth
              </label>
              {/* <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.6665 0.833313C7.12674 0.833313 7.49984 1.20641 7.49984 1.66665V2.49998H12.4998V1.66665C12.4998 1.20641 12.8729 0.833313 13.3332 0.833313C13.7934 0.833313 14.1665 1.20641 14.1665 1.66665V2.50133C14.5627 2.50406 14.909 2.51224 15.2097 2.53681C15.6781 2.57508 16.1087 2.65722 16.5131 2.86329C17.1403 3.18287 17.6503 3.6928 17.9699 4.32001C18.1759 4.72446 18.2581 5.15504 18.2963 5.62346C18.3198 5.9102 18.3283 6.23844 18.3314 6.61191C18.3326 6.63 18.3332 6.64825 18.3332 6.66665C18.3332 6.68101 18.3328 6.69529 18.3321 6.70948C18.3332 6.89502 18.3332 7.09134 18.3332 7.29888V14.3677C18.3332 15.0385 18.3332 15.5922 18.2963 16.0432C18.2581 16.5116 18.1759 16.9422 17.9699 17.3466C17.6503 17.9738 17.1403 18.4838 16.5131 18.8033C16.1087 19.0094 15.6781 19.0915 15.2097 19.1298C14.7587 19.1667 14.2051 19.1667 13.5343 19.1666H6.4654C5.7946 19.1667 5.24097 19.1667 4.78998 19.1298C4.32157 19.0915 3.89098 19.0094 3.48654 18.8033C2.85933 18.4838 2.34939 17.9738 2.02982 17.3466C1.82374 16.9422 1.7416 16.5116 1.70333 16.0432C1.66648 15.5922 1.66649 15.0385 1.6665 14.3677V7.2989C1.6665 7.09135 1.6665 6.89502 1.66759 6.70948C1.66687 6.69529 1.6665 6.68101 1.6665 6.66665C1.6665 6.64825 1.6671 6.63 1.66827 6.61191C1.67138 6.23844 1.6799 5.9102 1.70333 5.62346C1.7416 5.15504 1.82374 4.72446 2.02982 4.32001C2.34939 3.6928 2.85933 3.18287 3.48654 2.86329C3.89098 2.65722 4.32157 2.57508 4.78998 2.53681C5.09066 2.51224 5.43695 2.50406 5.83317 2.50133V1.66665C5.83317 1.20641 6.20627 0.833313 6.6665 0.833313ZM5.83317 4.16811C5.4619 4.17072 5.17036 4.17795 4.9257 4.19794C4.56036 4.22779 4.37352 4.28189 4.24319 4.3483C3.92958 4.50809 3.67462 4.76306 3.51483 5.07666C3.44842 5.207 3.39431 5.39383 3.36446 5.75918C3.36248 5.78342 3.36063 5.80812 3.35889 5.83331H16.6408C16.639 5.80812 16.6372 5.78342 16.6352 5.75918C16.6054 5.39383 16.5513 5.207 16.4848 5.07666C16.3251 4.76306 16.0701 4.50809 15.7565 4.3483C15.6262 4.28189 15.4393 4.22779 15.074 4.19794C14.8293 4.17795 14.5378 4.17072 14.1665 4.16811C14.1657 4.62768 13.7929 4.99998 13.3332 4.99998C12.8729 4.99998 12.4998 4.62688 12.4998 4.16665H7.49984C7.49984 4.62688 7.12674 4.99998 6.6665 4.99998C6.20676 4.99998 5.83397 4.62768 5.83317 4.16811ZM16.6665 7.49998H3.33317V14.3333C3.33317 15.0471 3.33382 15.5324 3.36446 15.9074C3.39431 16.2728 3.44842 16.4596 3.51483 16.59C3.67462 16.9036 3.92958 17.1585 4.24319 17.3183C4.37352 17.3847 4.56036 17.4388 4.9257 17.4687C5.30078 17.4993 5.78602 17.5 6.49984 17.5H13.4998C14.2137 17.5 14.6989 17.4993 15.074 17.4687C15.4393 17.4388 15.6262 17.3847 15.7565 17.3183C16.0701 17.1585 16.3251 16.9036 16.4848 16.59C16.5513 16.4596 16.6054 16.2728 16.6352 15.9074C16.6659 15.5324 16.6665 15.0471 16.6665 14.3333V7.49998ZM9.99709 9.18898C9.07509 8.60201 7.84171 8.5449 6.85225 9.36684C5.67517 10.3446 5.49184 12.0195 6.43697 13.2019C6.97141 13.8705 8.36014 15.0998 9.02217 15.676C9.02637 15.6796 9.03065 15.6834 9.03501 15.6872C9.09774 15.7418 9.17644 15.8104 9.252 15.8663C9.34299 15.9336 9.47236 16.0162 9.64433 16.0668C9.87361 16.1344 10.1215 16.1344 10.3508 16.0668C10.5227 16.0162 10.6521 15.9336 10.7431 15.8663C10.8187 15.8104 10.8974 15.7418 10.9601 15.6872C10.9645 15.6834 10.9687 15.6796 10.9729 15.676C11.635 15.0998 13.0237 13.8705 13.5581 13.2019C14.4956 12.0291 14.3458 10.3388 13.1341 9.35969C12.1395 8.55594 10.9174 8.60253 9.99709 9.18898ZM9.3719 10.8259C8.9532 10.35 8.34967 10.2896 7.91722 10.6489C7.42427 11.0584 7.37248 11.7029 7.73884 12.1613C8.1342 12.6559 9.27351 13.6817 9.99755 14.3151C10.7216 13.6817 11.8609 12.6559 12.2563 12.1613C12.6303 11.6934 12.5737 11.0496 12.0866 10.656C11.6311 10.288 11.0358 10.357 10.6232 10.8259C10.465 11.0058 10.2371 11.1088 9.99756 11.1088C9.75804 11.1088 9.53011 11.0058 9.3719 10.8259Z"
                      fill="#0F0E12"
                    />
                  </svg>
                </div>
                <input
                  id="DOB"
                  name="DOB"
                  type="text"
                  placeholder="mm/dd/yy"
                  className="block w-full rounded-md py-1.5 pl-10"
                />
              </div> */}
              <DatePicker
                onChange={setDob}
                id={"DOB"}
                initialDateInMillis={dob.getTime()}
              />
            </div>
            <div className="pt-10 sm:col-span-3">
              {/* <label
                htmlFor="linkedin"
                className="block  font-medium leading-6 text-gray-900"
              >
                LinkedIn Profile URL
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M18.3337 2.89217V17.1078C18.3337 17.4328 18.2045 17.7446 17.9747 17.9744C17.7449 18.2042 17.4332 18.3333 17.1082 18.3333H2.89248C2.56746 18.3333 2.25575 18.2042 2.02593 17.9744C1.79611 17.7446 1.66699 17.4328 1.66699 17.1078V2.89217C1.66699 2.56716 1.79611 2.25545 2.02593 2.02562C2.25575 1.7958 2.56746 1.66669 2.89248 1.66669L17.1082 1.66669C17.4332 1.66669 17.7449 1.7958 17.9747 2.02562C18.2045 2.25545 18.3337 2.56716 18.3337 2.89217ZM6.56895 8.03922H4.11797V15.8823H6.56895V8.03922ZM6.78954 5.34315C6.79083 5.15775 6.75559 4.97392 6.68584 4.80214C6.61608 4.63036 6.51317 4.47401 6.38299 4.342C6.2528 4.21 6.09789 4.10493 5.9271 4.03279C5.75631 3.96066 5.57298 3.92287 5.38758 3.92158H5.34346C4.96644 3.92158 4.60486 4.07136 4.33826 4.33795C4.07167 4.60455 3.92189 4.96613 3.92189 5.34315C3.92189 5.72017 4.07167 6.08175 4.33826 6.34835C4.60486 6.61494 4.96644 6.76471 5.34346 6.76471C5.52887 6.76928 5.71336 6.73726 5.8864 6.6705C6.05943 6.60373 6.21761 6.50353 6.3519 6.37561C6.48619 6.24769 6.59396 6.09456 6.66906 5.92498C6.74415 5.7554 6.78509 5.57268 6.78954 5.38727V5.34315ZM15.8827 11.1176C15.8827 8.75981 14.3827 7.84314 12.8925 7.84314C12.4046 7.81871 11.9188 7.92264 11.4835 8.14455C11.0483 8.36646 10.6789 8.6986 10.4121 9.10785H10.3435V8.03922H8.03954V15.8823H10.4905V11.7108C10.4551 11.2835 10.5897 10.8596 10.865 10.531C11.1404 10.2024 11.5343 9.99574 11.9611 9.95588H12.0542C12.8337 9.95588 13.4121 10.4461 13.4121 11.6814V15.8823H15.8631L15.8827 11.1176Z"
                      fill="#0F0E12"
                    />
                  </svg>
                </div>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  placeholder="@profileName"
                  className="block w-full rounded-md py-1.5 pl-10"
                />
              </div> */}
              <Input
                label="LinkedIn Profile URL"
                name="linkedin"
                placeholder="@profileName"
                value={linkedinURL}
                onChange={(e) => setLinkedinURL(e.target.value)}
                onInput={(e) => setLinkedinURLError(false)}
                error={linkedinURLError}
                errorMessage={errorMessage}
                svgIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M18.3337 2.89217V17.1078C18.3337 17.4328 18.2045 17.7446 17.9747 17.9744C17.7449 18.2042 17.4332 18.3333 17.1082 18.3333H2.89248C2.56746 18.3333 2.25575 18.2042 2.02593 17.9744C1.79611 17.7446 1.66699 17.4328 1.66699 17.1078V2.89217C1.66699 2.56716 1.79611 2.25545 2.02593 2.02562C2.25575 1.7958 2.56746 1.66669 2.89248 1.66669L17.1082 1.66669C17.4332 1.66669 17.7449 1.7958 17.9747 2.02562C18.2045 2.25545 18.3337 2.56716 18.3337 2.89217ZM6.56895 8.03922H4.11797V15.8823H6.56895V8.03922ZM6.78954 5.34315C6.79083 5.15775 6.75559 4.97392 6.68584 4.80214C6.61608 4.63036 6.51317 4.47401 6.38299 4.342C6.2528 4.21 6.09789 4.10493 5.9271 4.03279C5.75631 3.96066 5.57298 3.92287 5.38758 3.92158H5.34346C4.96644 3.92158 4.60486 4.07136 4.33826 4.33795C4.07167 4.60455 3.92189 4.96613 3.92189 5.34315C3.92189 5.72017 4.07167 6.08175 4.33826 6.34835C4.60486 6.61494 4.96644 6.76471 5.34346 6.76471C5.52887 6.76928 5.71336 6.73726 5.8864 6.6705C6.05943 6.60373 6.21761 6.50353 6.3519 6.37561C6.48619 6.24769 6.59396 6.09456 6.66906 5.92498C6.74415 5.7554 6.78509 5.57268 6.78954 5.38727V5.34315ZM15.8827 11.1176C15.8827 8.75981 14.3827 7.84314 12.8925 7.84314C12.4046 7.81871 11.9188 7.92264 11.4835 8.14455C11.0483 8.36646 10.6789 8.6986 10.4121 9.10785H10.3435V8.03922H8.03954V15.8823H10.4905V11.7108C10.4551 11.2835 10.5897 10.8596 10.865 10.531C11.1404 10.2024 11.5343 9.99574 11.9611 9.95588H12.0542C12.8337 9.95588 13.4121 10.4461 13.4121 11.6814V15.8823H15.8631L15.8827 11.1176Z"
                      fill="#0F0E12"
                    />
                  </svg>
                }
              />
            </div>

            <div className="pt-10 sm:col-span-6">
              <Textarea
                label="Street address"
                name="street-address"
                placeholder="123 Any Street"
                value={address || ""}
                onChange={(e) => setAddress(e.target.value)}
                onInput={(e) => setAddressError(false)}
                error={addressError}
                errorMessage={errorMessage}
                rows={2}
              />
            </div>

            <div className="pt-10 sm:col-span-2 sm:col-start-1">
              {/* <label
                htmlFor="city"
                className="block  font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Any City"
                  className="block w-full rounded-md py-1.5"
                />
              </div> */}
              <Input
                label="City"
                name="city"
                placeholder="Any City"
                value={city || ""}
                onChange={(e) => setCity(e.target.value)}
                onInput={(e) => setCityError(false)}
                error={cityError}
                errorMessage={errorMessage}
              />
            </div>

            <div className="pt-10 sm:col-span-2">
              <DropdownSelect
                name="Select state"
                label="State"
                values={stateOptions}
                onChange={(e) => setState(e.target.value)}
                onInput={(e) => setStateError(false)}
                selectedValue={state}
                error={stateError}
                errorMessage={errorMessage}
              />
            </div>

            <div className="pt-10 sm:col-span-2">
              {/* <label
                htmlFor="zip-code"
                className="block  font-medium leading-6 text-gray-900"
              >
                ZIP Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="zip-code"
                  id="zip-code"
                  placeholder="12345"
                  className="block w-full rounded-md py-1.5"
                />
              </div> */}
              <Input
                label="ZIP Code"
                name="zip-code"
                placeholder="12345"
                value={zipCode || ""}
                onChange={(e) => setZipCode(e.target.value)}
                onInput={(e) => setZipCodeError(false)}
                error={zipCodeError}
                errorMessage={errorMessage}
              />
            </div>
          </div>
          <p className="pt-10 text-lg font-bold not-italic leading-6">
            Program Information
          </p>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
            <div className="pt-4 sm:col-span-3">
              <DropdownSelect
                label="Program"
                name="Program"
                disabled={true}
                onChange={null}
                values={[
                  {
                    value: person.course,
                    name: person.groupInfo.course?.name || "TBD",
                  },
                ]}
                selectedValue={person.course}
              />
            </div>

            <div className="pt-4 sm:col-span-3">
              <label
                htmlFor="startDate"
                className="mb-1 block font-medium leading-6 text-gray-900"
              >
                Start date
              </label>
              <DatePicker
                disabled={true}
                onChange={null}
                id={"startDate"}
                initialDateInMillis={startDate.getTime()}
              />
            </div>
            <div className="pt-10 sm:col-span-3">
              <DropdownSelect
                label="Success Mentor"
                name="Success Mentor"
                disabled={true}
                onChange={null}
                values={coachDropdownValues}
                selectedValue={person.cohortInfo?.coach || "TBD"}
              />
            </div>
          </div>
          <div className="flex items-center justify-end pt-10">
            {person.onboarding.initial ? (
              <button
                type="button"
                className="tertiary-button mr-2 h-10 border-none px-4 shadow-none"
                onClick={() => cancelButtonClick()}
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              className="button-large h-10 w-20 px-4 shadow-none"
              onClick={(e) => updateUserData()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
