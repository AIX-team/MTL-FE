import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes } from 'react-icons/fa'; // 돋보기 아이콘 import, FaTimes 아이콘 추가
import '../../css/linkpage/SearchYoutube.css';
import youtubeIcon from '../../images/youtube.png';

const SearchYoutube = ({ linkData, setLinkData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const loadingRef = useRef(null);
    const [modalActive, setModalActive] = useState(false);

    // .env 파일에서 API 키 가져오기
    const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

    // 날짜 포맷팅 함수 추가
    const formatDate = (publishedAt) => {
        if (!publishedAt) return '';
        const date = new Date(publishedAt);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // 제목 텍스트 제한 함수 수정
    const truncateTitle = (title) => {
        if (title.length > 45) {
            return title.substring(0, 45) + '...';
        }
        return title;
    };

    const searchYoutube = async (query = searchQuery) => {
        if (!query.trim()) return;
        if (!YOUTUBE_API_KEY) {
            console.error('YouTube API Key is not configured');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Searching for:', query);

            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search`,
                {
                    params: {
                        part: 'snippet',
                        maxResults: 20,
                        key: YOUTUBE_API_KEY,
                        q: query,
                        type: 'video'
                    }
                }
            );

            if (response.data.items) {
                const videos = response.data.items.map(item => ({
                    id: item.id.videoId,
                    title: truncateTitle(item.snippet.title), // 45자로 제한
                    fullTitle: item.snippet.title, // 전체 제목 저장
                    thumbnail: item.snippet.thumbnails.medium.url,
                    channelTitle: item.snippet.channelTitle,
                    publishedAt: formatDate(item.snippet.publishedAt), // 날짜 포맷팅 적용
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    duration: item.snippet.duration
                }));

                setSearchResults(videos);
            }
        } catch (error) {
            console.error('YouTube 검색 중 오류 발생:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 링크 저장 부분 수정
    const isAlreadySaved = (url) => {
        return linkData.some(link =>
            // link가 문자열이거나 객체일 수 있으므로 둘 다 처리
            (typeof link === 'string' ? link === url : link.url === url)
        );
    };

    // 유튜브 링크 열기 함수 추가
    const openYoutubeLink = (videoUrl) => {
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
    };

    // 검색어 초기화 함수
    const clearSearch = () => {
        setSearchQuery('');
    };

    // 모달이 열릴 때 애니메이션을 위한 useEffect
    useEffect(() => {
        if (isModalOpen) {
            // 모달이 DOM에 마운트된 직후에 active 클래스를 추가
            setTimeout(() => {
                setModalActive(true);
            }, 10);
        } else {
            setModalActive(false);
        }
    }, [isModalOpen]);

    // 비디오 선택 핸들러 수정
    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
        setIsModalOpen(true);
    };

    // 모달 닫기 핸들러 수정
    const handleCloseModal = () => {
        setModalActive(false);
        // 애니메이션이 완료된 후 모달 닫기
        setTimeout(() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
        }, 300); // CSS 트랜지션 시간과 동일하게 설정
    };

    // 렌더링 시 현재 상태 확인
    console.log('현재 검색 결과:', searchResults);
    console.log('로딩 상태:', isLoading);

    return (
        <div className="WS-SearchYoutube">
            <div className="WS-SearchYoutube-Header">
                <div className="WS-SearchYoutube-InputWrapper">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchYoutube()}
                        placeholder="YouTube 검색어를 입력하세요"
                        className="WS-SearchYoutube-Input"
                    />
                    {searchQuery && (
                        <button
                            className="WS-SearchYoutube-ClearButton"
                            onClick={clearSearch}
                            type="button"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => searchYoutube()}
                    className="WS-SearchYoutube-Button"
                    disabled={isLoading}
                >
                    <FaSearch />
                </button>
            </div>

            <div className="WS-SearchYoutube-Results">
                {isLoading ? (
                    <div className="WS-SearchYoutube-Loading">검색 중...</div>
                ) : searchResults.length > 0 ? (
                    searchResults.map(video => (
                        <div
                            key={video.id}
                            className="WS-SearchYoutube-Item"
                            onClick={() => handleVideoSelect(video)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="WS-SearchYoutube-Thumbnail-Container">
                                <img
                                    src={video.thumbnail}
                                    alt={video.fullTitle}
                                    className="WS-SearchYoutube-Thumbnail"
                                />
                            </div>
                            <div className="WS-SearchYoutube-Info">
                                <h3 title={video.fullTitle}>{video.title}</h3>
                                <div className="WS-SearchYoutube-ChannelInfo">
                                    <span className="WS-SearchYoutube-ChannelName">
                                        {video.channelTitle}
                                    </span>
                                    <span className="WS-SearchYoutube-Date">
                                        {video.publishedAt}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="WS-SearchYoutube-NoResults">
                        검색 결과가 없습니다.
                    </div>
                )}
                <div ref={loadingRef} className="WS-SearchYoutube-LoadingMore">
                    {isLoading && (
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                </div>
            </div>

            {/* 모달 컴포넌트 추가 */}
            {isModalOpen && selectedVideo && (
                <div className={`WS-SearchYoutube-Modal-Overlay ${modalActive ? 'active' : ''}`} onClick={handleCloseModal}>
                    <div
                        className={`WS-SearchYoutube-Modal-Content ${modalActive ? 'active' : ''}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="WS-SearchYoutube-Modal-Close" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        <div className="WS-SearchYoutube-Modal-Body">
                            <div
                                className="WS-SearchYoutube-Modal-Thumbnail-Wrapper"
                                onClick={() => openYoutubeLink(selectedVideo.url)}
                            >
                                <img
                                    src={selectedVideo.thumbnail}
                                    alt={selectedVideo.fullTitle}
                                    className="WS-SearchYoutube-Modal-Thumbnail"
                                />
                                <span className="WS-SearchYoutube-Modal-Video-Icon">
                                    <img src={youtubeIcon} alt="YouTube" className="WS-SearchYoutube-Modal-Button-Icon" />
                                </span>

                            </div>
                            <h2 className="WS-SearchYoutube-Modal-Title">{selectedVideo.fullTitle}</h2>
                            <div className="WS-SearchYoutube-Modal-ChannelInfo">
                                <p className="WS-SearchYoutube-Modal-ChannelTitle">{selectedVideo.channelTitle}</p>
                                <p className="WS-SearchYoutube-Modal-Date">{selectedVideo.publishedAt}</p>
                            </div>


                            {!isAlreadySaved(selectedVideo.url) && (
                                <button
                                    onClick={() => {
                                        // 저장할 링크 데이터 형식 수정
                                        const linkToSave = {
                                            url: selectedVideo.url,
                                            title: selectedVideo.fullTitle,
                                            thumbnail: selectedVideo.thumbnail,
                                            type: 'youtube',  // 링크 타입을 구분하기 위해 추가
                                            channelTitle: selectedVideo.channelTitle,
                                            publishedAt: selectedVideo.publishedAt
                                        };
                                        setLinkData([...linkData, linkToSave]);
                                        handleCloseModal();
                                    }}
                                    className="WS-SaveLink-Modal-Button"
                                >
                                    링크 저장하기
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default SearchYoutube; 