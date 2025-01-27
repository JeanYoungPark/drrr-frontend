import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ICardItemsProps } from './type';
import { Link } from '@mui/material';
import { loginModalState } from '../../recoil/atom/loginModalState';
import { useEffect, useState } from 'react';
import { useProfileState } from '../../context/UserProfile';
import { useSetRecoilState } from 'recoil';
import {
    // deletePostLikedService,
    postIncreasedViewsService,
    // postTechBlogLikeIncreasedService,
} from '../../service/TechBlogService';
// import { techBlogDataState } from '../../recoil/atom/techBlogDataState';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function CardComponent({ item, index }: ICardItemsProps) {
    const { token } = useProfileState();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const setModalOpen = useSetRecoilState(loginModalState);
    // const setTechBlogData = useSetRecoilState(techBlogDataState);

    async function postIncreasedViewsRender(postId: number) {
        await postIncreasedViewsService(postId);
    }

    // async function deleteTechBlogLikedRender(postId: number) {
    //     await deletePostLikedService(postId);
    // }
    const handleLinkClick = () => {
        if (token === null || token === '') {
            setModalOpen(true);
            return;
        }
    };
    // const handlePostLike = async (id: number) => {
    //     if (!item.hasMemberLikedPost) {
    //         await postTechBlogLikeIncreasedService(id);
    //         setTechBlogData(prev => {
    //             return prev.map(item => {
    //                 if (item.techBlogPostBasicInfoDto.id === id) {
    //                     return {
    //                         ...item,
    //                         hasMemberLikedPost: true,
    //                     };
    //                 }
    //                 return item;
    //             });
    //         });
    //     } else {
    //         await deleteTechBlogLikedRender(id);
    //         setTechBlogData(prev => {
    //             return prev.map(item => {
    //                 if (item.techBlogPostBasicInfoDto.id === id) {
    //                     return {
    //                         ...item,
    //                         hasMemberLikedPost: false,
    //                     };
    //                 }
    //                 return item;
    //             });
    //         });
    //     }
    // };

    useEffect(() => {
        if (token === null || token === '') setIsLogin(true);
    }, [token]);

    return (
        <>
            {!isLogin ? (
                <Link
                    href={`/view/${item.techBlogPostBasicInfoDto.id}`}
                    color="text.primary"
                    underline="none"
                    sx={{
                        '&:hover': {
                            color: 'text.primary',
                        },
                        maxWidth: '49%',
                        minWidth: '49%',
                    }}
                    onClick={() =>
                        postIncreasedViewsRender(Number(item.techBlogPostBasicInfoDto.id))
                    }
                >
                    <Card
                        sx={{
                            marginTop: '15px',
                            backgroundColor: '#444444',
                            borderRadius: '20px',
                        }}
                        key={index}
                        id={item.techBlogPostBasicInfoDto.id}
                    >
                        <div className="px-6 pt-6">
                            <CardMedia
                                component="img"
                                image={item.techBlogPostBasicInfoDto.thumbnailUrl}
                                alt="썸네일"
                                sx={{ height: '175px', width: '100%', borderRadius: '20px' }}
                            />
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '0',
                                }}
                            >
                                <Link
                                    href={`${item.techBlogPostBasicInfoDto.url}`}
                                    target="_blank"
                                    color="text.primary"
                                    underline="none"
                                    sx={{
                                        '&:hover': {
                                            color: 'text.primary',
                                        },
                                    }}
                                    onClick={() =>
                                        postIncreasedViewsRender(
                                            Number(item.techBlogPostBasicInfoDto.id),
                                        )
                                    }
                                >
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                        sx={{
                                            fontSize: '20px',
                                            width: '100%',
                                            marginBottom: '1rem',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            marginTop: '1.8rem',
                                        }}
                                    >
                                        {item.techBlogPostBasicInfoDto.title}
                                    </Typography>
                                </Link>
                                <Link
                                    href={`/view/${item.techBlogPostBasicInfoDto.id}`}
                                    color="text.primary"
                                    underline="none"
                                    sx={{
                                        '&:hover': {
                                            color: 'text.primary',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            width: '100%',
                                            display: 'block',
                                            overflow: 'hidden',
                                            height: '6.5rem',
                                            marginBottom: '1.5rem',
                                            lineHeight: '1.25',
                                        }}
                                    >
                                        {item.techBlogPostBasicInfoDto.summary}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            paddingBottom: '1rem',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowarp',
                                            lineHeight: '1.25',
                                        }}
                                    >
                                        <ul className="flex flex-wrap w-full overflow-y-hidden h-[30px] ">
                                            {item.categoryDto?.map((item: any) => (
                                                <li
                                                    key={item.id}
                                                    id={item.id}
                                                    className="mr-2 text-xs"
                                                >
                                                    #{item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {/* <ul className="flex items-center gap-4">
                                            <li className="flex text-xs gap-1">
                                                <ThumbUpIcon
                                                    onClick={() =>
                                                        handlePostLike(
                                                            Number(
                                                                item.techBlogPostBasicInfoDto.id,
                                                            ),
                                                        )
                                                    }
                                                    sx={
                                                        item.hasMemberLikedPost
                                                            ? { color: '#E6783A', fontSize: '18px' }
                                                            : { color: '', fontSize: '18px' }
                                                    }
                                                />
                                                {/* <span className="flex items-center"> */}
                                        {/* {item.techBlogPostBasicInfoDto.likeCount} */}
                                        {/* </span> */}
                                        {/* </li> */}
                                        {/* <li className="text-xs flex items-center gap-1"> */}
                                        {/* <RemoveRedEyeIcon /> */}
                                        {/* <span> */}
                                        {/* {item.techBlogPostBasicInfoDto.viewCount} */}
                                        {/* </span> */}
                                        {/* </li> */}
                                        {/* </ul> */}
                                    </Typography>
                                </Link>
                            </CardContent>
                        </div>
                    </Card>
                </Link>
            ) : (
                <Link
                    color="text.primary"
                    underline="none"
                    sx={{
                        '&:hover': {
                            color: 'text.primary',
                        },
                        maxWidth: '49%',
                        minWidth: '49%',
                    }}
                    onClick={handleLinkClick}
                >
                    <Card
                        sx={{
                            marginTop: '15px',
                            backgroundColor: '#444444',
                            borderRadius: '20px',
                        }}
                        key={index}
                        id={item.techBlogPostBasicInfoDto.id}
                    >
                        <div className="px-6 pt-6">
                            <CardMedia
                                component="img"
                                image={item.techBlogPostBasicInfoDto.thumbnailUrl}
                                alt="썸네일"
                                sx={{ height: '175px', width: '100%', borderRadius: '20px' }}
                            />
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '0',
                                }}
                            >
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        fontSize: '20px',
                                        width: '100%',
                                        marginBottom: '1rem',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        marginTop: '1.8rem',
                                    }}
                                >
                                    {item.techBlogPostBasicInfoDto.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        width: '100%',
                                        display: 'block',
                                        overflow: 'hidden',
                                        height: '6.5rem',
                                        marginBottom: '1.5rem',
                                        lineHeight: '1.25',
                                    }}
                                >
                                    {item.techBlogPostBasicInfoDto.summary}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        paddingBottom: '1rem',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowarp',
                                        lineHeight: '1.25',
                                    }}
                                >
                                    <ul className="flex flex-wrap w-full overflow-y-hidden h-[30px] ">
                                        {item.categoryDto?.map((item: any) => (
                                            <li key={item.id} id={item.id} className="mr-2 text-xs">
                                                #{item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {/* <ul className="flex items-center "> */}
                                    {/* <li className="flex text-xs gap-1"> */}
                                    {/* <ThumbUpIcon /> */}
                                    {/* <span className="flex items-center"> */}
                                    {/* {item.techBlogPostBasicInfoDto.likeCount} */}
                                    {/* </span> */}
                                    {/* </li> */}
                                    {/* <li className="text-xs flex items-center gap-1"> */}
                                    {/* <RemoveRedEyeIcon /> */}
                                    {/* {item.techBlogPostBasicInfoDto.viewCount} */}
                                    {/* </li> */}
                                    {/* </ul> */}
                                </Typography>
                            </CardContent>
                        </div>
                    </Card>
                </Link>
            )}
        </>
    );
}
