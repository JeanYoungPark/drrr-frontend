import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { IndexingComponent } from '../components/topics/Indexing';
import { ListComponent } from '../components/topics/List';
import { getEtcIndexTopicsApi, getIndexTopicsApi, getSearchTopicsApi } from '../apis/topics';
import { useRecoilState } from 'recoil';
import { searchValueState, topicIndexState, topicState } from '../recoil/atom/topicsState';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function TopicPage() {
    const [, setTopics] = useRecoilState(topicState);
    const [page, setPage] = useState<number>(0);
    const [topicIndex, setTopicIndex] = useRecoilState(topicIndexState);
    const [searchVal, setSearchVal] = useRecoilState(searchValueState);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const obsRef = useIntersectionObserver(() => setPage(prev => prev + 1));

    // 검색 topic 무한 스크롤
    async function infiniteSearchTopics(value: string) {
        const res = await getSearchTopicsApi(page, value);

        if (res.status === 200) {
            setTopics(prev => [...prev, ...res.data.content]);
        }
    }

    // 검색 기능 디바운스를 사용하여 함수 실행 지연
    function handleSearch(value: string) {
        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(async () => {
            setSearchVal(value);
            setPage(0);
            setTopicIndex('');

            const res = await getSearchTopicsApi(page, value);

            if (res.status === 200) {
                setTopics(res.data.content);
            }
        }, 1000);

        setTimer(newTimer);
    }

    // 인덱스 topic 무한 스크롤
    async function infiniteIndexTopics(index: string) {
        let res: any = null;

        if (index === '기타') {
            res = await getEtcIndexTopicsApi(page);
        } else {
            res = await getIndexTopicsApi(page, index);
        }

        if (res.status === 200) {
            setTopics(prev => [...prev, ...res.data.content]);
        }
    }

    // 인덱스별 topic 호출
    async function handleIndex(index: string) {
        let res: any = null;
        setSearchVal('');
        setPage(0);

        if (index === '기타') {
            setTopicIndex('기타');
            res = await getEtcIndexTopicsApi(0);
        } else {
            setTopicIndex(index);
            res = await getIndexTopicsApi(0, index);
        }

        if (res.status === 200) {
            setTopics(res.data.content);
        }
    }

    useEffect(() => {
        if (page > 0) {
            searchVal && infiniteSearchTopics(searchVal);
            topicIndex !== 'all' && topicIndex !== '' && infiniteIndexTopics(topicIndex);
        }
    }, [page]);

    return (
        <div className="w-full p-10">
            <div className="flex flex-col item-center mb-10">
                <h1 className="text-center mb-8">Explore topics</h1>
                <TextField
                    id="filled-basic"
                    value={searchVal}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Enter topic..."
                    variant="filled"
                    sx={{
                        '& .MuiFilledInput-root': {
                            borderRadius: '30px',
                        },
                        '.MuiFilledInput-root::before': {
                            display: 'none',
                        },
                        '.MuiFilledInput-root::after': {
                            display: 'none',
                        },
                        '& .MuiFormLabel-root': {
                            left: '10px',
                        },
                        '.MuiInputBase-input': {
                            padding: '15px 0 15px 20px',
                        },
                    }}
                />
            </div>
            <div className="flex justify-between items-center w-full h-[32px]">
                <IndexingComponent onHandleIndex={handleIndex} />
            </div>
            <div className="w-full mt-10">
                <ListComponent onHandleIndex={handleIndex} />
            </div>
            <div ref={obsRef} />
        </div>
    );
}
