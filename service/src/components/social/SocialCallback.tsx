import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { SocialService, SignInService } from '../../service/auth/SocialService';
import { modalOpenState } from '../../recoil/atom/modalOpenState';
import { providerIdState } from '../../recoil/atom/providerIdState';
import { setAuthStorage } from '../../repository/AuthRepository';
import { profileImageUrlState } from '../../recoil/atom/profileImageUrlState';

export default function SocialCallback() {
    const [didMount, setDidMount] = useState(false);

    const setProviderIdState = useSetRecoilState(providerIdState);
    const code = new URL(document.location.toString()).searchParams.get('code');
    const setModalOpen = useSetRecoilState(modalOpenState);
    const setImgUrl = useSetRecoilState(profileImageUrlState);
    const location = useLocation();
    const state = location.pathname.split('/')[1];
    const ACCESSTOKEN_KEY = 'accessToken';
    const REFRESHTOKEN_KEY = 'refreshToken';
    const navigate = useNavigate();

    async function socialLoginRender(
        isRegistered: string,
        providerId: string,
        profileImageUrl: string,
    ) {
        if (isRegistered) {
            const authData = await SignInService(providerId);
            setAuthStorage(
                ACCESSTOKEN_KEY,
                authData.accessToken,
                REFRESHTOKEN_KEY,
                authData.refreshToken,
            );
            setProviderIdState(providerId);
            navigate('/');
        } else {
            navigate('/');
            setProviderIdState(providerId);
            setImgUrl(profileImageUrl);
            setModalOpen(true);
        }
    }

    const handleKakaoLogin = async () => {
        const data = await SocialService(code, state);
        socialLoginRender(data.isRegistered, data.providerId, data.profileImageUrl);
    };

    useEffect(() => {
        setDidMount(true);
    }, []);

    useEffect(() => {
        if (didMount) {
            handleKakaoLogin();
        }
    }, [didMount]);

    return <div>로그인 중...</div>;
}