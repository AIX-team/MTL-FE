import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa'; // 돋보기 아이콘 import, FaTimes 아이콘 추가
import '../../css/linkpage/SearchYoutube.css';
import youtubeIcon from '../../images/YOUTUBE_LOGO.png';

const SearchYoutube = ({ linkData, setLinkData, isLinkLimitReached }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState(new Set()); // 선택된 비디오 ID 저장

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

    const searchYoutube = async () => {
        // searchQuery가 없거나 공백만 있는 경우 검색하지 않음
        if (!searchQuery?.trim()) return;

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
        setSearchResults([]);
    };

    const handleVideoSelect = (videoId, e) => {
        e.stopPropagation();
        setSelectedVideos(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(videoId)) {
                newSelected.delete(videoId);
            } else {
                if (newSelected.size < 5) { // 최대 5개까지만 선택 가능
                    newSelected.add(videoId);
                }
            }
            return newSelected;
        });
    };

    const handleYoutubeIconClick = () => {
        window.open('https://www.youtube.com', '_blank', 'noopener,noreferrer');
    };

    // 렌더링 시 현재 상태 확인
    console.log('현재 검색 결과:', searchResults);
    console.log('로딩 상태:', isLoading);

    // YouTube 비디오 URL 생성 함수
    const getVideoUrl = (videoId) => {
        return `https://www.youtube.com/watch?v=${videoId}`;
    };

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

            <div className="WS-SearchYoutube-Results">
                {isLoading ? (
                    <div className="WS-SearchYoutube-Loading">검색 중...</div>
                ) : searchResults.length > 0 ? (
                    searchResults.map((video) => (
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
                                    <FaCheck id="WS-SearchYoutube-Checkbox-Check"/>
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
                    ))
                ) : (
                    <div className="WS-SearchYoutube-NoResults">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchYoutube; 