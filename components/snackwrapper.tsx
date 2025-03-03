'use client'
import { submitData } from '@/app/actions';
import { SnackbarProvider } from '@swat-sccs/react-simple-snackbar';
import { useFormStatus } from 'react-dom';
import SettingsForm from './settingsform';
import { StudentOverlay } from '@prisma/client';
import { useActionState } from 'react';

const initialState = {
    message: "",
};

export default function SnackbarWrapper({ user_data }: { user_data: StudentOverlay }) {

    const { pending } = useFormStatus();
    const [state, formAction] = useActionState(submitData, initialState);

    return (
        <SnackbarProvider>
            <form action={formAction}>
                <SettingsForm inData={user_data} pending={pending} state={state} />
            </form>
        </SnackbarProvider>
    )
}