import React, { useState } from 'react';
import SignUpModal from '../../components/SignUpModal';

function SignUp() {
    const [isModalOpen, setModalOpen] = useState(true); 

    const openLoginModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <SignUpModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    )
}

export default SignUp;
