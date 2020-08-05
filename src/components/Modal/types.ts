export type ModalProps = {
    children: JSX.Element | Element;
    show: boolean;
    isLoading: boolean;
    onClickAction: () => void
    onClose: () => void,
    title: string
};
