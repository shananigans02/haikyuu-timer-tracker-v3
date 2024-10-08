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

    test('elapsed time calc - timer automatically stops and records when reaching zero', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);
        
        // Set duration to 5 seconds
        const durationInput = getByLabelText('duration:');
        fireEvent.change(durationInput, { target: { value: '5' } });
        
        // Start timer
        fireEvent.click(getByText('start'));
        
        // Advance timer by 5 seconds
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        
        // Timer should be stopped and set recorded
        expect(getByText('start')).toBeInTheDocument(); // Not 'pause'
        expect(getByText(/5 secs/)).toBeInTheDocument();
    });
    

    test('elapsed time calc - no pauses, manually record', () => {
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

    test('elapsed time calc - with 1 pause, resume for a while, then record', () => {
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

    test('elapsed time calc - with 1 pause then straight to record', () => {
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

    test('elapsed time calc - with 1 pause, resume for a while, 1 pause, resume for a while and straight to record', () => {
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

    test('elapsed time calc - with 1 pause, resume for a while, 1 pause, resume for a while and straight to record', () => {
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

    test('long duration timer works correctly', () => {
        const { getByText, getByLabelText } = render(<TimerComponent />);
        
        // Set duration to 15 minutes (900 seconds)
        const durationInput = getByLabelText('duration:');
        fireEvent.change(durationInput, { target: { value: '900' } });
        
        fireEvent.click(getByText('start'));
        
        // Advance timer by 14 minutes
        act(() => {
            jest.advanceTimersByTime(840000); // 14 minutes
        });
        
        // Verify timer is still running
        expect(getByText('pause')).toBeInTheDocument();
        
        // Advance to completion
        act(() => {
            jest.advanceTimersByTime(60000); // 1 more minute
        });
        
        // Timer should be stopped and 15 minutes recorded
        expect(getByText('start')).toBeInTheDocument();
        expect(getByText(/15 mins/)).toBeInTheDocument();
    });    

    test('timer correctly handles browser tab switches and pauses', () => {
        // Set up necessary hooks and start the timer
        jest.useFakeTimers(); // Use fake timers to control time manually
        const { getByText, getByLabelText } = render(<TimerComponent />);
        
        // Set duration to 35 minutes (2100 seconds)
        const durationInput = getByLabelText('duration:');
        fireEvent.change(durationInput, { target: { value: '2100' } });
        
        // Start timer
        fireEvent.click(getByText('start'));
        
        // Advance by 5 minutes on the active tab
        act(() => {
            jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
        });
    
        // Simulate tab becoming inactive
        act(() => {
            document.dispatchEvent(new Event('visibilitychange'));
            Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        });
        
        // Advance time while tab is inactive for 20 minutes
        act(() => {
            jest.advanceTimersByTime(20 * 60 * 1000); // 20 minutes
        });
    
        // Simulate tab becoming active again
        act(() => {
            Object.defineProperty(document, 'hidden', { value: false, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));
        });
    
        // Pause the timer after 5 minutes of being active again
        fireEvent.click(getByText('pause'));
        act(() => {
            jest.advanceTimersByTime(10 * 60 * 1000); // Wait 10 minutes while paused
        });
    
        // Resume timer
        fireEvent.click(getByText('start'));
    
        // Immediately switch to another tab after resuming (10 minutes left)
        act(() => {
            document.dispatchEvent(new Event('visibilitychange'));
            Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        });
    
        // Advance time by 10 minutes for the remaining duration
        act(() => {
            jest.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
        });
    
        // Simulate tab becoming active again after timer runs out
        act(() => {
            Object.defineProperty(document, 'hidden', { value: false, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));
        });
    
        // Timer should be stopped and recorded should be 35 minutes
        expect(getByText('start')).toBeInTheDocument(); // Button should now say "start" since the timer stopped
        expect(getByText(/35 mins/)).toBeInTheDocument(); // Verify 35 minutes recorded
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