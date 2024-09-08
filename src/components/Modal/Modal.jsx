import React from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.css';

ReactModal.setAppElement('#root'); // For accessibility

export default function Modal({ isOpen, setIsOpen, children }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            {children}
        </ReactModal>
    );
}
