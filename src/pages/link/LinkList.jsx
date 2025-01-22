import React, { useState } from 'react';
import Modal from '../link/LinkPageModal';
import '../../css/linkpage/LinkPageModal.css';
import '../../css/linkpage/LinkList.css';

const LinkList = () => {
    const [inputLink, setInputLink] = useState('');
    const [links, setLinks] = useState([]);
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

    // 링크 추가 처리
    const handleAddLink = () => {
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
            showModal('YouTube 또는 네이버 블로그 URL만 지원합니다.');
            return;
        }

        const newLink = {
            id: Date.now(),
            type: linkType,
            url: inputLink
        };

        setLinks([...links, newLink]);
        setInputLink(''); // 입력창 초기화
    };


    return (
        <div className="WS-LinkList">
            {/* 검색 입력창 */}
            <div className="WS-LinkList-Search">
                <input
                    type="text"
                    placeholder="유튜브 or 블로그 링크"
                    className="WS-LinkList-SearchInput"
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <button className="WS-LinkList-AddButton" onClick={handleAddLink}> + </button>
            </div>

            {/* 링크 목록 */}
            <div className="WS-LinkList-Items">
                {links.map(link => (
                    <div
                        key={link.id}
                        className={`WS-LinkList-Item ${link.type}`}
                    >
                        <span className="WS-LinkList-Badge">
                            {link.type === 'youtube' ? 'YOUTUBE' : 'Blog'}
                        </span>
                        <span className="WS-LinkList-Text">{link.url}</span>
                    </div>
                ))}
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