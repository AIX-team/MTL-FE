import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa'; // 돋보기 아이콘 import, FaTimes 아이콘 추가
import '../../css/linkpage/SearchYoutube.css';
import youtubeIcon from '../../images/YOUTUBE_LOGO.png';
import Modal from '../../layouts/AlertModal';

const SearchYoutube = ({ linkData, setLinkData }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('youtubeSearchQuery', searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem('youtubeSearchResults', JSON.stringify(searchResults));
    }, [searchResults]);

    useEffect(() => {
        localStorage.setItem('youtubeSelectedVideos', JSON.stringify(selectedVideos));
    }, [selectedVideos]);

    // 컴포넌트 마운트 시 검색어 이력 조회
    useEffect(() => {
        const fetchRecentSearches = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/user/search/recent', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setRecentSearches(response.data);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('검색어 이력 조회 실패:', error);
                    setIsLoggedIn(true);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        fetchRecentSearches();
    }, []);

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

    // 검색 함수 저장 및 호출 프로세스
    const searchYoutube = async () => {
        if (!searchQuery?.trim()) return;

        setIsLoading(true);
        try {
            // 검색어 저장
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.post('http://localhost:8080/user/search/save',
                        { searchTerm: searchQuery.trim() },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                } catch (error) {
                    console.error('검색어 저장 실패:', error);
                    navigate('/login');
                }
            }

            // 유튜브 검색 API 호출
            console.log('Searching for:', searchQuery);
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search`,
                {
                    params: {
                        part: 'snippet',
                        maxResults: 20,
                        key: YOUTUBE_API_KEY,
                        q: searchQuery,
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
            setSearchResults([]); // 에러 발생 시 빈 배열
        } finally {
            setIsLoading(false);
        }
    };

    // 검색어 초기화
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        localStorage.removeItem('youtubeSearchQuery');
        localStorage.removeItem('youtubeSearchResults');
    };

    const handleVideoSelect = (video) => {
        // 이미 선택된 비디오인지 확인
        const isAlreadySelected = selectedVideos.some(v => v.url === `https://www.youtube.com/watch?v=${video.id}`);

        if (isAlreadySelected) {
            // 이미 선택된 비디오라면 제거
            setSelectedVideos(prev => prev.filter(v => v.url !== `https://www.youtube.com/watch?v=${video.id}`));
        } else {
            // 새로운 비디오 선택 시 최대 개수 체크
            if (linkData.length + selectedVideos.length >= 5) {
                setModalMessage('링크는 최대 5개까지만 추가할 수 있습니다.');
                setModalOpen(true);
                return;
            }

            // 새로운 비디오 추가
            const newVideo = {
                url: `https://www.youtube.com/watch?v=${video.id}`,
                type: 'youtube',
                id: Date.now()
            };
            setSelectedVideos(prev => [...prev, newVideo]);
        }
    };

    const handleSaveSelected = () => {
        setLinkData(prev => [...prev, ...selectedVideos]);
        setSelectedVideos([]); // 선택된 비디오 목록 초기화
    };

    // 렌더링 시 현재 상태 확인
    console.log('현재 검색 결과:', searchResults);
    console.log('로딩 상태:', isLoading);

    return (
        <div className="WS-SearchYoutube-Tab">
            <div className="WS-SearchYoutube-Search">
                <div className="WS-Link-Input-Container">
                    <input
                        type="text"
                        value={searchQuery || ''}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchYoutube()}
                        placeholder="YouTube 검색어를 입력하세요"
                        className="WS-Link-Input"
                    />

                    <div className="WS-Link-Button-Container" id="WS-SearchYoutube-Button-Container">
                        {searchQuery && (
                            <button
                                className="WS-SearchYoutube-ClearButton"
                                onClick={clearSearch}
                                type="button"
                                aria-label="검색어 지우기"
                            >
                                <FaTimes />
                            </button>
                        )}

                        <button
                            onClick={searchYoutube}
                            className="WS-SearchYoutube-SearchButton"
                            disabled={isLoading}
                            aria-label="검색"
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>

                <div className="WS-SearchYoutube-RecentSearches">
                    {isLoggedIn ? (
                        recentSearches.length > 0 ? (
                            <>
                                <h4>최근 검색어</h4>
                                <div className="WS-SearchYoutube-RecentSearches-List">
                                    {recentSearches.map((term, index) => (
                                        <div
                                            key={index}
                                            className="WS-SearchYoutube-RecentSearch-Item"
                                            onClick={() => {
                                                setSearchQuery(term.word);
                                                searchYoutube();
                                            }}
                                        >
                                            {term.word}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="WS-SearchYoutube-NoSearches">최근 검색 기록이 없습니다.</p>
                        )
                    ) : (
                        <p className="WS-SearchYoutube-LoginRequired">
                            검색어 저장을 위해 로그인이 필요합니다.
                        </p>
                    )}
                </div>
            </div>

            <div className={`WS-SearchYoutube-Results ${selectedVideos.length > 0 ? 'has-selected' : ''}`}>
                {isLoading ? (
                    <div className="WS-SearchYoutube-Loading">검색 중...</div>
                ) : searchResults.length > 0 ? (
                    <>
                        {searchResults.map((video) => (
                            <div
                                key={video.id}
                                className={`WS-SearchYoutube-Results-Item ${selectedVideos.some(v => v.url === `https://www.youtube.com/watch?v=${video.id}`) ? 'selected' : ''
                                    }`}
                                onClick={() => handleVideoSelect(video)}
                            >
                                <div className="WS-SearchYoutube-Thumbnail-Container">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.fullTitle}
                                        className="WS-SearchYoutube-Thumbnail"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
                                        }}
                                        className="WS-youtube-icon-link"
                                    >
                                        <img
                                            src={youtubeIcon}
                                            alt="YouTube"
                                            className="WS-youtube-icon"
                                        />
                                    </button>
                                    <div className="WS-SearchYoutube-Checkbox">
                                        <FaCheck id="WS-SearchYoutube-Checkbox-Check" />
                                    </div>
                                </div>

                                <div className="WS-SearchYoutube-Info-Container">
                                    <h3 className="WS-SearchYoutube-Title" title={video.fullTitle}>{video.title}</h3>
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
                        ))}
                        {selectedVideos.length > 0 && (
                            <button
                                className={`WS-SearchYoutube-SaveButton ${selectedVideos.length > 0 ? 'active' : ''}`}
                                onClick={handleSaveSelected}
                            >
                                링크 저장 ({selectedVideos.length} / 5)
                            </button>
                        )}
                    </>
                ) : (
                    <div className="WS-SearchYoutube-NoResults">
                        <div className="WS-SearchYoutube-RecentSearches-Title">최근 검색어</div>
                        <div className="WS-SearchYoutube-RecentSearches">
                            {recentSearches.map((keyword, index) => (
                                <button
                                    key={index}
                                    className="WS-SearchYoutube-RecentSearch-Tag"
                                    onClick={() => {
                                        setSearchQuery(keyword);
                                        searchYoutube();
                                    }}
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default SearchYoutube; 