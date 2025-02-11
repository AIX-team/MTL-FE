import React, { useState, useEffect } from 'react';
import Modal from '../../layouts/AlertModal';
import '../../css/linkpage/LinkList.css';
import { FaMinus } from 'react-icons/fa';
import SelectDayTab from './SelectDayTab';

const LinkList = ({ linkData, setLinkData }) => {
    const [inputLink, setInputLink] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showDayTab, setShowDayTab] = useState(false);

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
        return null;
    };

    // URL 중복 체크 함수
    const isLinkDuplicate = (url) => {
        return linkData.some(link => {
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
            setInputLink('');
            return;
        }

        const type = getLinkType(inputLink);
        if (!type) {
            showModal('지원하지 않는 URL입니다.');
            return;
        }

        const newLink = {
            url: inputLink,
            type: type,
            id: Date.now()
        };

        setLinkData(prev => [...prev, newLink]);
        setInputLink('');
    };

    // 링크 삭제 함수
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
        <div className="WS-LinkList-Tab">
            <div className="WS-Link-Input-Container">
                <input
                    id="WS-Link-Input"
                    type="text"
                    placeholder="유튜브 또는 블로그 링크 붙여넣기"
                    className="WS-Link-Input"
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <button className="WS-LinkList-AddButton" onClick={handleAddLink}> + </button>
            </div>

            <div className="WS-LinkList-Items">
                {linkData.map((link, index) => (
                    <div
                        key={index}
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
                                {link.url.length > 25 ? `${link.url.substring(0, 25)}...` : link.url}
                            </span>

                            <button
                                className="WS-LinkList-DeleteButton"
                                onClick={() => handleDeleteLink(link.id)}
                                title="삭제"
                            >
                                <FaMinus />
                            </button>
                        </div>
                    </div>
                ))}

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

            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default LinkList;