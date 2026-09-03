import React from 'react';
import { RegistrationModal } from './RegistrationModal';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  return <RegistrationModal isOpen={isOpen} onClose={onClose} />;
};

export default JoinModal;
