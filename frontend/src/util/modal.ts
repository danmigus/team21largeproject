import {createContext, ReactNode} from "react";

export const ModalContext = createContext<(newModal: ReactNode | ReactNode[] | null) => void>(null)
