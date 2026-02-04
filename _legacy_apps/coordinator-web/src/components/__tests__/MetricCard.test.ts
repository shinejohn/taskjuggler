import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MetricCard from '../dashboard/MetricCard.vue';

describe('MetricCard', () => {
  it('renders metric card with title and value', () => {
    const wrapper = mount(MetricCard, {
      props: {
        title: 'Total Calls',
        value: '150',
        icon: 'Phone',
      },
    });

    expect(wrapper.text()).toContain('Total Calls');
    expect(wrapper.text()).toContain('150');
  });

  it('displays trend indicator when provided', () => {
    const wrapper = mount(MetricCard, {
      props: {
        title: 'Calls Today',
        value: '25',
        trend: { value: '+10%', direction: 'up' },
      },
    });

    expect(wrapper.text()).toContain('+10%');
  });
});

