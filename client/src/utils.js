import { format, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInYears } from 'date-fns';

export const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    const minutes = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);
    const days = differenceInDays(now, date);
    const weeks = differenceInWeeks(now, date);
    const years = differenceInYears(now, date);

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} ${days > 1 ? 'days' : 'day'} ago`;
    } else if (years < 1) {
        return format(date, 'dd MMM');
    } else {
        return format(date, 'MMMM yyyy');
    }
}


export const groupMessagesByConversations = (messages, loggedUserUsername) => {
    const conversations = {};

    messages.forEach(message => {

        const interlocutor = message.sender.username === loggedUserUsername ? message.recipient : message.sender;
        const interlocutorId = interlocutor.id;


        if (!conversations[interlocutorId]) {
            conversations[interlocutorId] = {
                user: interlocutor,
                messages: []
            };
        }


        conversations[interlocutorId].messages.push(message);
    });

    return Object.values(conversations);
};


export const handleDownload = async (url, name) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = `${name}.jpg`;
        const blobUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};
