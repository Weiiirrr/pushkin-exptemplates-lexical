/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

import jsPsych from 'pushkin-jspsych';
import stimArray from './stim.js';
import timeline from './experiment.js';

// jest.mock('./stim', () => ({
//   // Mock the stimArray module
// }));

// jest.mock('./experiment', () => ({
//   // Mock the experiment module
// }));

describe('experiment', () => {

  it('should import required modules', () => {
    expect(jsPsych).toBeDefined();
    expect(stimArray).toBeDefined();
    expect(timeline).toBeDefined();
  });

  it('should contain expected experiment timeline', () => {
    expect(timeline.length).toBe(5);
    expect(timeline[0].type).toBe('html-keyboard-response');
    expect(timeline[1].type).toBe('html-keyboard-response');
    expect(timeline[2].type).toBe('html-keyboard-response');
    expect(timeline[3].timeline[0].type).toBe('html-keyboard-response');
    expect(timeline[4].type).toBe('html-keyboard-response');
  });

  it('should validate the stimArray content', () => {
    stimArray.forEach(stim => {
      expect(stim.word_1).toBeDefined();
      expect(stim.word_2).toBeDefined();
      expect(stim.both_words).toBeDefined();
      expect(stim.related).toBeDefined();
    });
  });
})

describe('data_summary', () => {
    it('should calculate performance on task and return a formatted string', () => {
      // Arrange
      const mockMean = jest.fn(() => 1000);
      const mockCount = jest.fn(() => 10);
      const jsPsych = {
        data: {
          get: jest.fn(() => ({
            filter: jest.fn(() => ({
              select: jest.fn(() => ({
                mean: mockMean
              })),
              count: mockCount
            }))
          })),
          NO_KEYS: 'no_keys'
        }
      };
  
      const debrief = 'debrief text';
  
      const data_summary = {
        type: 'html-keyboard-response',
        stimulus: function () {
          // Calculate performance on task
          var mean_rt_related = this.jsPsych.data.get().filter({ related: true, both_words: true, correct: true }).select('rt').mean();
          var correct_related = this.jsPsych.data.get().filter({ related: true, both_words: true, correct: true }).count();
  
          var mean_rt_unrelated = this.jsPsych.data.get().filter({ related: false, both_words: true, correct: true }).select('rt').mean();
          var correct_unrelated = this.jsPsych.data.get().filter({ related: false, both_words: true, correct: true }).count();
  
          // Show results and debrief
          return '<p>You got ' + correct_related + ' related words correct! Your average response time for related words: ' + Math.round(mean_rt_related) + 'ms</p>' +
              '<p>You got ' + correct_unrelated + ' unrelated words correct! Average response time for unrelated words: ' + Math.round(mean_rt_unrelated) + 'ms</p>' + this.debrief
        }.bind({ jsPsych, debrief }),
        choices: jsPsych.NO_KEYS
      };
  
      // Act
      const result = data_summary.stimulus();
  
      // Assert
      const expected = '<p>You got 10 related words correct! Your average response time for related words: 1000ms</p>' +
        '<p>You got 10 unrelated words correct! Average response time for unrelated words: 1000ms</p>debrief text';
      expect(result).toBe(expected);
    });
  });
  
