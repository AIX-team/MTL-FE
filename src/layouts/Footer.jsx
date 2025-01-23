import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/layout/Footer.css';
import LINK from '../images/Link.png';
import TRAVEL from '../images/Travel.png'; 
import MYPAGE from '../images/MyPage.png';

const FooterComponent = () => {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();

    const getClassName = (path) => {
        switch(path) {
            case '/link':
                // /link로 시작하는 모든 경로에서 Link 메뉴 활성화
                return `WS-Footer-Item${currentPath.startsWith('/link') ? ' active' : ''}`;
            case '/travel':
                return `WS-Footer-Item${currentPath.startsWith('/travel') ? ' active' : ''}`;
            case '/mypage':
                return `WS-Footer-Item${currentPath.startsWith('/mypage') ? ' active' : ''}`;
            default:
                return 'WS-Footer-Item';
        }
    };

    return (
        <footer className="WS-Footer-Container">
            {/* Link 메뉴 아이템 */}
            <Link to="/link" className={getClassName('/link')}>
                <img src={LINK} alt="Link" className="WS-Footer-Link" />
                <div>Link</div>
            </Link>

            {/* Travel 메뉴 아이템 */}
            <Link to="/travel" className={getClassName('/travel')}>
                <img src={TRAVEL} alt="Travel" className="WS-Footer-Travel" />
                <div>Travel</div>
            </Link>

            {/* MyPage 메뉴 아이템 */}
            <Link to="/mypage" className={getClassName('/mypage')}>
                <img src={MYPAGE} alt="MyPage" className="WS-Footer-MyPage" />
                <div>MyPage</div>
            </Link>
        </footer>
    );
};

export default FooterComponent;

// 완료 ==================================================================