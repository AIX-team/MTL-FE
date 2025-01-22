import React, { useState, useEffect } from 'react';
import Modal from '../link/LinkPageModal';
import '../../css/linkpage/LinkPageModal.css';
import '../../css/linkpage/LinkList.css';
import axios from 'axios';
import { FaMinus } from 'react-icons/fa';

const LinkList = ({ linkData, setLinkData }) => {
    const [inputLink, setInputLink] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

    // 링크 추가 처리 수정
    const handleAddLink = () => {
        // 링크가 5개 이상이면 추가 불가
        if (linkData.length >= 5) {
            showModal('링크는 최대 5개까지만 추가할 수 있습니다.');
            return;
        }

        if (!inputLink.trim()) {
            showModal('URL을 입력해주세요.');
            return;
        }

        // URL 형식 검사
        if (!isValidUrl(inputLink)) {
            showModal('올바른 URL 형식이 아닙니다.');
            return;
        }

        // 링크 타입 확인
        const linkType = getLinkType(inputLink);
        if (!linkType) {
            showModal('YouTube 또는 네이버 블로그 URL만 입력해주세요.');
            return;
        }

        const newLink = {
            id: Date.now(),
            type: linkType,
            url: inputLink
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

    return (
        <div className="WS-LinkList">
            {/* 검색 입력창 */}
            <div className="WS-LinkList-Search">
                <input
                    type="text"
                    placeholder="유튜브 또는 블로그 링크 붙여넣기"
                    className="WS-LinkList-SearchInput"
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
            </div>

            {/* 분석하기 버튼 추가 */}
            <div className="WS-LinkList-Analyze">
                <div className="WS-LinkList-Counter">
                    {linkData.length}/5
                </div>
                <button
                    className="WS-LinkList-AnalyzeButton"
                    disabled={linkData.length === 0}
                    onClick={() => {/* 분석 로직 추가 */ }}
                >
                    분석하기
                </button>

            </div>

            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default LinkList;