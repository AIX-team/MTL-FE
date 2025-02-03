import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa'; // 돋보기 아이콘 import, FaTimes 아이콘 추가
import '../../css/linkpage/SearchYoutube.css';
import youtubeIcon from '../../images/YOUTUBE_LOGO.png';
import Modal from '../../layouts/SomethingModal';

const SearchYoutube = () => {
    // localStorage에서 이전 상태 불러오기
    const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('youtubeSearchQuery') || '');
    const [searchResults, setSearchResults] = useState(() => {
        const saved = localStorage.getItem('youtubeSearchResults');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedVideos, setSelectedVideos] = useState(() => {
        const saved = localStorage.getItem('youtubeSelectedVideos');
        return new Set(saved ? JSON.parse(saved) : []);
    });
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('youtubeRecentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();

    // 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('youtubeSearchQuery', searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem('youtubeSearchResults', JSON.stringify(searchResults));
    }, [searchResults]);

    useEffect(() => {
        localStorage.setItem('youtubeSelectedVideos', JSON.stringify([...selectedVideos]));
    }, [selectedVideos]);

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

    // 최근 검색어 저장
    const addRecentSearch = (query) => {
        if (!query.trim()) return;

        setRecentSearches(prev => {
            const filtered = prev.filter(item => item !== query);
            const newSearches = [query, ...filtered].slice(0, 5);
            localStorage.setItem('youtubeRecentSearches', JSON.stringify(newSearches));
            return newSearches;
        });
    };

    // 검색 함수 수정
    const searchYoutube = async () => {
        if (!searchQuery?.trim()) return;

        addRecentSearch(searchQuery.trim());
        setIsLoading(true);
        try {
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

    // 검색어 초기화 함수 수정
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        localStorage.removeItem('youtubeSearchQuery');
        localStorage.removeItem('youtubeSearchResults');
    };

    const handleVideoSelect = (videoId, e) => {
        e.stopPropagation();
        setSelectedVideos(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(videoId)) {
                newSelected.delete(videoId);
            } else {
                if (newSelected.size >= 5) {
                    setModalMessage(`링크는 최대 ${newSelected.size}개까지만 가능합니다.`);
                    setModalOpen(true);
                    return prev;
                }
                newSelected.add(videoId);
            }
            return newSelected;
        });
    };

    // const handleSaveLinks = () => {
    //     // 선택된 비디오 링크 생성
    //     const selectedVideoLinks = searchResults
    //         .filter(video => selectedVideos.has(video.id))
    //         .map(video => ({
    //             url: `https://www.youtube.com/watch?v=${video.id}`,
    //             type: 'youtube',
    //             id: Date.now() + Math.random()
    //         }));

    //     // 현재 저장된 링크 데이터 확인
    //     const currentLinks = JSON.parse(localStorage.getItem('linkListData') || '[]');

    //     // URL 중복 체크 및 중복되지 않은 링크만 필터링
    //     const normalizeUrl = (url) => {
    //         try {
    //             const normalized = new URL(url);
    //             return normalized.hostname + normalized.pathname + normalized.search;
    //         } catch {
    //             return url;
    //         }
    //     };

    //     // 중복 링크와 비중복 링크 분리
    //     const duplicateLinks = selectedVideoLinks.filter(newLink =>
    //         currentLinks.some(existingLink =>
    //             normalizeUrl(existingLink.url) === normalizeUrl(newLink.url)
    //         )
    //     );

    //     const nonDuplicateLinks = selectedVideoLinks.filter(newLink =>
    //         !currentLinks.some(existingLink =>
    //             normalizeUrl(existingLink.url) === normalizeUrl(newLink.url)
    //         )
    //     );

    //     setSelectedVideos(prev => {
    //         const newSelected = new Set(prev);
    //         // duplicateIds.forEach(id => newSelected.delete(id));
    //         return newSelected;
    //     });

    //     if (nonDuplicateLinks.length === 0) {
    //         setModalMessage('선택한 모든 링크가 이미 등록되어 있습니다.');
    //         setModalOpen(true);
    //         return;
    //     }


    //     // 총 링크 개수가 5개를 초과하는지 확인
    //     if (currentLinks.length + nonDuplicateLinks.length > 5) {
    //         setModalMessage(`더이상 링크를 추가 할 수 없습니다.`);
    //         setModalOpen(true);
    //         return;
    //     }

    //     // 중복되지 않은 링크들만 저장
    //     localStorage.setItem('selectedYoutubeLinks', JSON.stringify(nonDuplicateLinks));

    //     const duplicateCount = duplicateLinks.length;
    //     const message = duplicateCount > 0
    //         ? `${nonDuplicateLinks.length}개의 링크가 저장되었습니다. (${duplicateCount}개는 중복)`
    //         : `${nonDuplicateLinks.length}개의 링크가 저장되었습니다.`;

    //     setModalMessage(message);
    //     setModalOpen(true);
    // };

    const handleSaveLinks = async () => {
        const selectedVideoLinks = searchResults.filter(video => selectedVideos.has(video.id));
        if (selectedVideoLinks.length === 0) {
            setModalMessage('선택된 링크가 없습니다.');
            setModalOpen(true);
            return;
        }

        // 사용자 이메일은 로그인 정보나 localStorage에서 가져온다고 가정합니다.
        const email = localStorage.getItem('userEmail'); // 예시

        let successCount = 0;
        let failedCount = 0;
        let failedMessages = [];
        for (let video of selectedVideoLinks) {
            try {
                const response = await axios.post(
                    'http://localhost:8080/youtube/saveLink',
                    {
                        email: email,
                        url: `https://www.youtube.com/watch?v=${video.id}`
                    }
                );
                if (response.data.message) {
                    successCount += 1;
                }
            } catch (error) {
                failedCount += 1;
                failedMessages.push(error.response?.data?.detail || error.message);
            }
        }

        if (successCount > 0) {
            setModalMessage(`${successCount}개의 링크가 저장되었습니다.${failedCount > 0 ? ` (${failedCount}개는 저장 실패: ${failedMessages.join('; ')})` : ''}`);
        } else {
            setModalMessage(`링크 저장에 실패했습니다: ${failedMessages.join('; ')}`);
        }
        setModalOpen(true);
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
            </div>

            <div className={`WS-SearchYoutube-Results ${selectedVideos.size > 0 ? 'has-selected' : ''}`}>
                {isLoading ? (
                    <div className="WS-SearchYoutube-Loading">검색 중...</div>
                ) : searchResults.length > 0 ? (
                    <>
                        {searchResults.map((video) => (
                            <div
                                key={video.id}
                                className={`WS-SearchYoutube-Results-Item ${selectedVideos.has(video.id) ? 'selected' : ''}`}
                                onClick={(e) => handleVideoSelect(video.id, e)}
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
                        {selectedVideos.size > 0 && (
                            <button
                                className={`WS-SearchYoutube-SaveButton ${selectedVideos.size > 0 ? 'active' : ''}`}
                                onClick={handleSaveLinks}
                            >
                                링크 저장 ({selectedVideos.size} / 5)
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