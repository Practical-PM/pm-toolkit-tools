import { Modal, ModalActions } from '@toolkit-pm/design-system/components'
import { WaterfallConfigComponent } from './WaterfallConfig'
import './ConfigModal.css'

export function ConfigModal({ isOpen, onClose, waterfall, onUpdate }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Waterfall Configuration"
    >
      <WaterfallConfigComponent waterfall={waterfall} onUpdate={onUpdate} />
      <ModalActions
        onCancel={onClose}
        cancelLabel="Close"
      />
    </Modal>
  )
}
