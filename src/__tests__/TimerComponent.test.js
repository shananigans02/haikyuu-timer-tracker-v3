import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimerComponent from '../TimerComponent';

describe('TimerComponent', () => {
    beforeEach(() => {
        // Clear all mocks and timers before each test
        jest.useFakeTimers();
        jest.spyOn(global, 'setInterval');
        jest.spyOn(global, 'clearInterval');
        });

        afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('initial render', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);

        expect(getByText('timer header')).toBeInTheDocument();
        expect(getByLabelText('duration:')).toHaveValue(5);
        expect(getByText('time left: 0:05')).toBeInTheDocument();
        expect(getByText('start')).toBeInTheDocument();
    });

    test('timer starts correctly', () => {
        const { getByText } = render(<TimerComponent />);

        fireEvent.click(getByText('start'));

        expect(getByText('pause')).toBeInTheDocument();
        expect(global.setInterval).toHaveBeenCalledTimes(1);
        expect(global.setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });

    test('elapsed time calculation - no pauses', () => {
        const { getByText } = render(<TimerComponent />);

        // Start timer
        fireEvent.click(getByText('start'));

        // Advance timer by 3 seconds
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        // Record the set
        fireEvent.click(getByText('record'));

        // Check if the recorded set shows 3 seconds
        expect(getByText(/3 secs/)).toBeInTheDocument();
    });

    test('elapsed time test - with 1 pause, resume for a while, then record', () => {
        const { getByText } = render(<TimerComponent />);

        fireEvent.click(getByText('start'));
        act(() => {
            jest.advanceTimersByTime(2000);
        });
        fireEvent.click(getByText('pause'));

        // Wait 5 seconds (shouldn't count)
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        // Resume
        fireEvent.click(getByText('start'));

        // Advance 2 more seconds
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        // Record
        fireEvent.click(getByText('record'));

        // Should show 4 seconds total
        expect(getByText(/4 secs/)).toBeInTheDocument();
    });

    test('elapsed time test - with 1 pause then straight to record', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);

        // set duration to be 20s
        const durationInput = getByLabelText('duration:');
        fireEvent.change(durationInput, { target: {value: '20' } });

        fireEvent.click(getByText('start'));

        act(() => {
            jest.advanceTimersByTime(7000); // 7s passes
        });

        fireEvent.click(getByText('pause'));

        act(() => {
            jest.advanceTimersByTime(41000); // 41s pause
        });

        fireEvent.click(getByText('start'));

        act(() => {
            jest.advanceTimersByTime(10000) // 10s passes
        });

        fireEvent.click(getByText('record')); 
        expect(getByText(/17 secs/)).toBeInTheDocument();
    });

    test('elapsed time test - with 1 pause, resume for a while, 1 pause, resume for a while and straight to record', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);

        // set duration to be 30s
        const durationInput = getByLabelText('duration:');
        fireEvent.change(durationInput, { target: {value: '30' } });

        fireEvent.click(getByText('start'));
        act(() => {
            jest.advanceTimersByTime(5000); // 5s passes
        });

        fireEvent.click(getByText('pause'));
        act(() => {
            jest.advanceTimersByTime(11000); // wait 11s
        });

        // Resume
        fireEvent.click(getByText('start'));
        
        act(() => {
            jest.advanceTimersByTime(12000); // 12s passes
        });

        fireEvent.click(getByText('pause'));
        act(() => {
            jest.advanceTimersByTime(21000); // wait 21s
        });

        fireEvent.click(getByText('start'));
        act(() => {
            jest.advanceTimersByTime(2000); // 2s passes
        });

        // Record
        fireEvent.click(getByText('record'));

        // Should show 4 seconds total
        expect(getByText(/19 secs/)).toBeInTheDocument();
    });

    test('elapsed time test - with 1 pause, resume for a while, 1 pause, resume for a while and straight to record', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);

        // set duration to be 30s
        const durationInput = getByLabelText('duration:');
        fireEvent.change(durationInput, { target: {value: '30' } });

        fireEvent.click(getByText('start'));
        act(() => {
            jest.advanceTimersByTime(9000); // 9s passes
        });

        fireEvent.click(getByText('pause'));
        act(() => {
            jest.advanceTimersByTime(11000); // wait 11s
        });

        // Resume
        fireEvent.click(getByText('start'));
        
        act(() => {
            jest.advanceTimersByTime(11000); // 11s passes
        });

        fireEvent.click(getByText('pause'));
        act(() => {
            jest.advanceTimersByTime(33000); // wait 35s
        });

        // Record
        fireEvent.click(getByText('record'));

        // Should show 4 seconds total
        expect(getByText(/20 secs/)).toBeInTheDocument();
    });


    test('input field is disabled during timer run', () => {
        const { getByLabelText, getByText } = render(<TimerComponent />);
        const input = getByLabelText('input:');

        expect(input).not.toBeDisabled();

        fireEvent.click(getByText('start'));
        expect(input).toBeDisabled();

        fireEvent.click(getByText('pause'));
        expect(input).toBeDisabled();

        fireEvent.click(getByText('stop'));
        expect(input).not.toBeDisabled();
    });

    test('stopping timer resets all values', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);

        fireEvent.click(getByText('start'));
        act(() => {
            jest.advanceTimersByTime(2000);
        });
        fireEvent.click(getByText('stop'));

        // Check reset values
        expect(getByLabelText('duration:')).toHaveValue(30);
        expect(getByText('time left: 0:05')).toBeInTheDocument();
        expect(getByText('start')).toBeInTheDocument();
    });


});