import React, { useState, useEffect } from 'react';
import Modal from '../../layouts/SomethingModal';
import '../../css/linkpage/LinkList.css';
import axios from 'axios';
import { FaMinus } from 'react-icons/fa';
import SelectDayTab from './SelectDayTab';  
import { useNavigate } from 'react-router-dom';  // 추가



const LinkList = ({ linkData, setLinkData }) => {
    const [inputLink, setInputLink] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showDayTab, setShowDayTab] = useState(false);

    // linkData가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('linkListData', JSON.stringify(linkData));
    }, [linkData]);

    // 모달 표시 함수
    const showModal = (message) => {
        setModalMessage(message);
        setModalOpen(true);
    };

    // URL 유효성 검사 함수
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    // 링크 타입 확인 함수
    const getLinkType = (url) => {
        const loweredUrl = url.toLowerCase();
        if (loweredUrl.includes('youtube.com') || loweredUrl.includes('youtu.be')) {
            return 'youtube';
        } else if (loweredUrl.includes('naver.com') || loweredUrl.includes('blog.naver')) {
            return 'blog';
        }
        return null; // 지원하지 않는 URL인 경우
    };

    // URL 중복 체크 함수
    const isLinkDuplicate = (url) => {
        return linkData.some(link => {
            // URL을 정규화하여 비교 (http/https, www 유무, 끝의 슬래시 등 무시)
            const normalizeUrl = (url) => {
                try {
                    const normalized = new URL(url);
                    return normalized.hostname + normalized.pathname + normalized.search;
                } catch {
                    return url;
                }
            };
            return normalizeUrl(link.url) === normalizeUrl(url);
        });
    };

    // 링크 추가 처리
    const handleAddLink = () => {
        if (linkData.length >= 5) {
            showModal('링크는 최대 5개까지만 추가할 수 있습니다.');
            return;
        }

        if (!inputLink.trim()) {
            showModal('URL을 입력해주세요.');
            return;
        }

        if (!isValidUrl(inputLink)) {
            showModal('올바른 URL 형식이 아닙니다.');
            return;
        }

        if (isLinkDuplicate(inputLink)) {
            showModal('이미 등록된 링크입니다.');
            setInputLink(''); // 입력창 초기화
            return;
        }

        // 링크 타입 확인 및 추가
        const type = getLinkType(inputLink);
        const newLink = {
            url: inputLink,
            type: type,
            id: Date.now() // 고유 ID 생성
        };

        setLinkData([...linkData, newLink]);
        setInputLink(''); // 입력창 초기화
    };

    // axios 나중에 수정=================================
    const fetchLinks = async () => {
        try {
            const response = await axios.get('/api/links'); // API 엔드포인트에 맞게 수정 필요
            return response.data;
        } catch (error) {
            console.error('Failed to fetch links:', error);
            return [];
        }
    };
    // axios 나중에 수정=================================

    useEffect(() => {
        const fetchData = async () => {
            if (linkData.length === 0) {
                const fetchedData = await fetchLinks();
                setLinkData(fetchedData);
            }
        };

        fetchData();
    }, [linkData.length, setLinkData]);

    useEffect(() => {
        const checkSelectedLinks = () => {
            try {
                const selectedLinks = localStorage.getItem('selectedYoutubeLinks');
                if (selectedLinks) {
                    const links = JSON.parse(selectedLinks);
                    if (links && Array.isArray(links) && links.length > 0) {
                        setLinkData(prevLinks => {
                            const newTotalLength = prevLinks.length + links.length;
                            if (newTotalLength > 5) {
                                showModal('링크는 최대 5개까지만 추가할 수 있습니다.');
                                return prevLinks;
                            }
                            return [...prevLinks, ...links];
                        });
                        localStorage.removeItem('selectedYoutubeLinks');
                    }
                }
            } catch (error) {
                console.error('Error checking selected links:', error);
            }
        };

        // 초기 실행
        checkSelectedLinks();

        // 주기적으로 확인
        const interval = setInterval(checkSelectedLinks, 300);

        return () => clearInterval(interval);
    }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

    // URL 텍스트 제한 함수 추가
    const truncateUrl = (url) => {
        if (url.length > 25) {
            return url.substring(0, 25) + '...';
        }
        return url;
    };

    // 링크 삭제 함수 추가
    const handleDeleteLink = (idToDelete) => {
        setLinkData(linkData.filter(link => link.id !== idToDelete));
    };

    const handleNextClick = () => {
        setShowDayTab(true);
    };

    const handleBack = () => {
        setShowDayTab(false);
    };

    if (showDayTab) {
        return <SelectDayTab onBack={handleBack} />;
    }

    return (
        <div className="WS-LinkList">
            {/* 검색 입력창 */}
            <div className="WS-Link-Input-Container">
                <input
                    id="WS-Link-Input"
                    type="text"
                    placeholder="유튜브 or 블로그 링크 붙여넣기"
                    className="WS-Link-Input"
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <button className="WS-LinkList-AddButton" onClick={handleAddLink}> + </button>
            </div>

            {/* 링크 목록 */}
            <div className="WS-LinkList-Items">
                {linkData.map(link => (
                    <div
                        key={link.id}
                        className={`WS-LinkList-Item ${link.type}`}
                    >
                        <div className="WS-LinkList-Content">
                            <span className="WS-LinkList-Badge">
                                {link.type === 'youtube' ? 'YOUTUBE' : 'Blog'}
                            </span>
                            <span
                                className="WS-LinkList-Text"
                                title={link.url}
                            >
                                {truncateUrl(link.url)}
                            </span>
                        </div>
                        <button
                            className="WS-LinkList-DeleteButton"
                            onClick={() => handleDeleteLink(link.id)}
                            title="삭제"
                        >
                            <FaMinus />
                        </button>
                    </div>
                ))}

                {/* 다음으로 버튼 */}
                <div className="WS-LinkList-Next-Container">
                    <div className="WS-LinkList-Counter">
                        {linkData.length}/5
                    </div>
                    <button
                        className="WS-LinkList-NextButton"
                        disabled={linkData.length === 0}
                        onClick={handleNextClick}
                    >
                        다음
                    </button>
                </div>
            </div>

            {/* 기존 알림 모달 */}
            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default LinkList;