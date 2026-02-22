import { useState, useEffect } from 'react';
import { AgendaEvent } from '@/lib/types/seller/agenda';
import { MOCK_ORDERS, MOCK_APPOINTMENTS, MOCK_SPECIALISTS, buildUnifiedEvents } from '@/lib/mocks/mockAgendaData';

export function generateCalendarDays(currentMonth: Date) {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Adjust to Monday start

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const calendarCells: { day: number; date: Date; isOtherMonth: boolean }[] = [];

    // Previous Month
    for (let i = firstDay; i > 0; i--) {
        calendarCells.push({ day: prevMonthDays - i + 1, date: new Date(year, month, -i + 1), isOtherMonth: true });
    }

    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push({ day: i, date: new Date(year, month, i), isOtherMonth: false });
    }

    // Next Month (to complete 42 cells)
    const remaining = 42 - calendarCells.length;
    for (let i = 1; i <= remaining; i++) {
        calendarCells.push({ day: i, date: new Date(year, month + 1, i), isOtherMonth: true });
    }

    return calendarCells;
}

export function useAgenda() {
    const [events, setEvents] = useState<AgendaEvent[]>([]);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 0, 1));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 600)); // Simula llamada API
            const unified = buildUnifiedEvents(MOCK_ORDERS, MOCK_APPOINTMENTS, MOCK_SPECIALISTS);
            setEvents(unified);
            setIsLoading(false);
        };
        fetchEvents();
    }, []);

    const nextMonth = () => {
        const next = new Date(currentMonth);
        next.setMonth(next.getMonth() + 1);
        setCurrentMonth(next);
    };

    const prevMonth = () => {
        const prev = new Date(currentMonth);
        prev.setMonth(prev.getMonth() - 1);
        setCurrentMonth(prev);
    };

    return {
        events,
        currentMonth,
        isLoading,
        nextMonth,
        prevMonth
    };
}
