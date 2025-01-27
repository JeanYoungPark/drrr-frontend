import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Button } from '@mui/base/Button';

import { userInformationState } from '../../recoil/atom/userInformationState';
import {
    SignUpEmail,
    SignUpEmailValidation,
    nickNameValidation,
} from '../../service/auth/SocialService';
import { providerIdState } from '../../recoil/atom/providerIdState';
import { ValueProps, ISignFormProps } from './type';
import SignUpInputForm from './SignUpInputForm';
import ModalTitle from '../../stories/modalTitle/ModalTitle';
import { msg } from '../../constants/message';

export default function SingUpForm({ onSignupNext, onHandleClose }: ISignFormProps) {
    const [profileValue, setProfileValue] = useRecoilState(userInformationState);
    const [emailCodeValue, setEmailCodeValue] = useState('');
    const [emailCodeVerified, setEmailCodeVerified] = useState(false);
    const [errorMsg, setErrorMsg] = useState({
        nickname: '',
        email: '',
    });

    const [count, setCount] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const providerId = useRecoilValue(providerIdState);

    async function nickNameValidationRender() {
        if (profileValue.nickname.length !== 0) {
            const data = await nickNameValidation(profileValue.nickname);
            if (data.isDuplicate === true) {
                setErrorMsg(prevErrorMsg => ({
                    ...prevErrorMsg,
                    nickname: msg.nickNameDuplicate,
                }));
                setButtonDisabled(false);
                return;
            } else {
                setErrorMsg({
                    email: '',
                    nickname: msg.nickNameSuccess,
                });
                setButtonDisabled(true);
            }
        }
    }

    async function emailVaildationRender() {
        if (emailCodeValue !== '') {
            const emailStatusData = await SignUpEmailValidation({
                providerId,
                verificationCode: emailCodeValue,
            });

            if (emailStatusData !== undefined) {
                if (emailStatusData.data.isVerified) {
                    setErrorMsg(prevErrorMsg => ({
                        ...prevErrorMsg,
                        email: msg.emailSuccess,
                    }));
                    setEmailCodeVerified(true);
                } else {
                    setErrorMsg(prevErrorMsg => ({
                        ...prevErrorMsg,
                        email: msg.emailFailed,
                    }));
                    setEmailCodeVerified(false);
                }
            }
        }
    }

    const handleNextClick = () => {
        onSignupNext();
    };

    const handleEmailCertificationButton = () => {
        const emailValidationState = validationEmailChecked(profileValue.email);
        if (emailValidationState === undefined) {
            setErrorMsg({
                nickname: '',
                email: '',
            });
            setCount(180);
            emailCodeRender();
        } else {
            setErrorMsg(prevErrorMsg => ({
                ...prevErrorMsg,
                email: msg.email,
            }));
        }
    };
    const handleEmailAuthenticationChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmailCodeValue(value);
    };

    const handleSignup = (profileValue: ValueProps) => {
        if (errorMsg.email === msg.emailFailed || profileValue.email === '') {
            setErrorMsg(prevErrorMsg => ({
                ...prevErrorMsg,
                email: msg.email,
            }));
            setEmailCodeVerified(false);
            return;
        }
        if (profileValue.nickname === '') {
            setErrorMsg(prevErrorMsg => ({
                ...prevErrorMsg,
                nickname: msg.nickName,
            }));
            setEmailCodeVerified(false);

            return;
        }
    };

    async function emailCodeRender() {
        const validationData = await SignUpEmail({
            providerId,
            email: { email: profileValue.email },
        });
        if (validationData?.status !== 200)
            setErrorMsg(prevErrorMsg => ({
                ...prevErrorMsg,
                email: msg.emailDuplicate,
            }));
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileValue(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validationEmailChecked = (value: string) => {
        let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
        if (!regex.test(value)) {
            setErrorMsg(prevErrorMsg => ({
                ...prevErrorMsg,
                email: msg.email,
            }));
            return false;
        }
    };
    useEffect(() => {
        setEmailCodeVerified(false);
    }, [emailCodeValue]);

    return (
        <>
            <div className="flex flex-col items-center w-full gap-2 ">
                <ModalTitle onHangleCloseClick={onHandleClose} state="signup" />
                <SignUpInputForm
                    onEmailCertificationButton={handleEmailCertificationButton}
                    onEmailAuthenticationChange={handleEmailAuthenticationChange}
                    onInputChange={handleInputChange}
                    onCount={count}
                    onSetCount={setCount}
                    onNickNameValidationRender={nickNameValidationRender}
                />
                <p className="text-sm text-red-500">{errorMsg.email && errorMsg.email}</p>
                <p className="text-sm text-red-500">{errorMsg.nickname && errorMsg.nickname}</p>

                {emailCodeVerified ? (
                    <Button
                        onClick={() => {
                            handleSignup(profileValue);
                            handleNextClick();
                        }}
                        aria-label="다음"
                        disabled={!buttonDisabled}
                        slotProps={{
                            root: () => ({
                                className: `bg-[#E6783A] w-9/12 text-white rounded-1xl h-10 text-center`,
                            }),
                        }}
                    >
                        다음
                    </Button>
                ) : (
                    <Button
                        onClick={emailVaildationRender}
                        aria-label="인증"
                        disabled={!buttonDisabled}
                        slotProps={{
                            root: () => ({
                                className: `bg-[#E6783A] w-9/12 text-white rounded-1xl h-10 text-center`,
                            }),
                        }}
                    >
                        인증
                    </Button>
                )}
            </div>
        </>
    );
}
