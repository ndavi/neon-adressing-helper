import HomepageVue from '@/home/infrastructure/primary/HomepageVue.vue';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('When visiting the homepage', () => {
  it('Should provide an example CSV template when the user wants to download it', async () => {
    const { createObjectURLMock, linkMock, clickMock } = givenMockedDomForDownload();
    const wrapper = givenHomepage();

    await whenEnteringNumberOfControllers(wrapper, 5);
    await whenConfiguringExampleState(wrapper);
    await whenClickingOnDownload(wrapper);

    await thenCsvContentIsCorrect(createObjectURLMock);
    thenFileIsDownloaded(linkMock, clickMock);
  });

  it('Should allow the user to set the number of LED controllers', async () => {
    const wrapper = givenHomepage();

    await whenEnteringNumberOfControllers(wrapper, 5);

    thenNumberOfControllersIs(wrapper, 5);
  });

  it('Should display configuration cards for each controller', async () => {
    const wrapper = givenHomepage();

    await whenEnteringNumberOfControllers(wrapper, 2);

    thenControllerCardsAreDisplayed(wrapper, 2);
  });
});

const givenHomepage = (): VueWrapper => {
  return mount(
    {
      template: '<v-app><HomepageVue /></v-app>',
    },
    {
      global: {
        components: {
          HomepageVue,
        },
      },
    },
  ).findComponent(HomepageVue);
};

const givenMockedDomForDownload = () => {
  const createObjectURLMock = vi.fn();
  vi.stubGlobal('URL', {
    createObjectURL: createObjectURLMock,
    revokeObjectURL: vi.fn(),
  });

  const clickMock = vi.fn();
  const linkMock = document.createElement('a');
  vi.spyOn(linkMock, 'setAttribute');
  vi.spyOn(linkMock, 'click').mockImplementation(clickMock);

  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
    if (tagName === 'a') {
      return linkMock;
    }
    return originalCreateElement(tagName, options);
  });

  vi.spyOn(document.body, 'appendChild').mockImplementation(() => linkMock);
  vi.spyOn(document.body, 'removeChild').mockImplementation(() => linkMock);

  return { createObjectURLMock, linkMock, clickMock };
};

const whenClickingOnDownload = async (wrapper: VueWrapper) => {
  await wrapper.find('.button').trigger('click');
};

const whenEnteringNumberOfControllers = async (wrapper: VueWrapper, count: number) => {
  const input = wrapper.find('input#controllers-count');
  await input.setValue(count);
};

const whenConfiguringExampleState = async (wrapper: VueWrapper) => {
  // Configure controller counts
  const cards = wrapper.findAll('.controller-card');
  for (let i = 0; i < 5; i++) {
    const targetCount = i < 4 ? 8 : 4;
    const card = cards[i];
    if (!card) throw new Error(`Controller card ${i} not found`);
    const inputs = card.findAll('input');
    // Index 1: outputs count
    const input = inputs[1];
    if (!input) throw new Error('Output input not found');
    await input.setValue(targetCount);
  }

  // Add bars
  // Iterating by index to re-fetch wrapper at each step prevents stale element issues
  for (let i = 0; i < 5; i++) {
    const outputCount = i < 4 ? 8 : 4;

    for (let k = 0; k < outputCount; k++) {
      // Re-find the card and buttons at this exact moment
      const currentCard = wrapper.findAll('.controller-card')[i];
      if (!currentCard) throw new Error(`Card ${i} not found`);

      const outputCards = currentCard.findAllComponents({ name: 'LedOutputCard' });
      const outputCard = outputCards[k];
      if (!outputCard) throw new Error(`Output card ${k} not found for C${i}`);

      // Emit 'add-bar' once
      outputCard.vm.$emit('add-bar');
      await wrapper.vm.$nextTick(); // Wait for parent to react

      // Check if we need a second bar
      // C0-C3: outputs 0-1 get 2 bars.
      // C4: all outputs get 2 bars.
      const needsSecondBar = (i < 4 && k < 2) || i === 4;
      if (needsSecondBar) {
        outputCard.vm.$emit('add-bar');
        await wrapper.vm.$nextTick();
      }
    }
  }
};

const thenCsvContentIsCorrect = async (createObjectURLMock: any) => {
  const expectedCsv = `Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name
BARRE NEON - 2M;0;1;10;0;10;200;15;CONTROLLEUR-0/C0-OUT-1/LED-0
BARRE NEON - 2M;0;358;10;200;10;400;15;CONTROLLEUR-0/C0-OUT-1/LED-1
BARRE NEON - 2M;1;203;50;0;50;200;15;CONTROLLEUR-0/C0-OUT-2/LED-2
BARRE NEON - 2M;2;48;50;200;50;400;15;CONTROLLEUR-0/C0-OUT-2/LED-3
BARRE NEON - 2M;2;405;90;0;90;200;15;CONTROLLEUR-0/C0-OUT-3/LED-4
BARRE NEON - 2M;3;250;130;0;130;200;15;CONTROLLEUR-0/C0-OUT-4/LED-5
BARRE NEON - 2M;4;95;170;0;170;200;15;CONTROLLEUR-0/C0-OUT-5/LED-6
BARRE NEON - 2M;4;452;210;0;210;200;15;CONTROLLEUR-0/C0-OUT-6/LED-7
BARRE NEON - 2M;5;297;250;0;250;200;15;CONTROLLEUR-0/C0-OUT-7/LED-8
BARRE NEON - 2M;6;142;290;0;290;200;15;CONTROLLEUR-0/C0-OUT-8/LED-9
BARRE NEON - 2M;20;1;450;0;450;200;15;CONTROLLEUR-1/C1-OUT-1/LED-10
BARRE NEON - 2M;20;358;450;200;450;400;15;CONTROLLEUR-1/C1-OUT-1/LED-11
BARRE NEON - 2M;21;203;490;0;490;200;15;CONTROLLEUR-1/C1-OUT-2/LED-12
BARRE NEON - 2M;22;48;490;200;490;400;15;CONTROLLEUR-1/C1-OUT-2/LED-13
BARRE NEON - 2M;22;405;530;0;530;200;15;CONTROLLEUR-1/C1-OUT-3/LED-14
BARRE NEON - 2M;23;250;570;0;570;200;15;CONTROLLEUR-1/C1-OUT-4/LED-15
BARRE NEON - 2M;24;95;610;0;610;200;15;CONTROLLEUR-1/C1-OUT-5/LED-16
BARRE NEON - 2M;24;452;650;0;650;200;15;CONTROLLEUR-1/C1-OUT-6/LED-17
BARRE NEON - 2M;25;297;690;0;690;200;15;CONTROLLEUR-1/C1-OUT-7/LED-18
BARRE NEON - 2M;26;142;730;0;730;200;15;CONTROLLEUR-1/C1-OUT-8/LED-19
BARRE NEON - 2M;40;1;890;0;890;200;15;CONTROLLEUR-2/C2-OUT-1/LED-20
BARRE NEON - 2M;40;358;890;200;890;400;15;CONTROLLEUR-2/C2-OUT-1/LED-21
BARRE NEON - 2M;41;203;930;0;930;200;15;CONTROLLEUR-2/C2-OUT-2/LED-22
BARRE NEON - 2M;42;48;930;200;930;400;15;CONTROLLEUR-2/C2-OUT-2/LED-23
BARRE NEON - 2M;42;405;970;0;970;200;15;CONTROLLEUR-2/C2-OUT-3/LED-24
BARRE NEON - 2M;43;250;1010;0;1010;200;15;CONTROLLEUR-2/C2-OUT-4/LED-25
BARRE NEON - 2M;44;95;1050;0;1050;200;15;CONTROLLEUR-2/C2-OUT-5/LED-26
BARRE NEON - 2M;44;452;1090;0;1090;200;15;CONTROLLEUR-2/C2-OUT-6/LED-27
BARRE NEON - 2M;45;297;1130;0;1130;200;15;CONTROLLEUR-2/C2-OUT-7/LED-28
BARRE NEON - 2M;46;142;1170;0;1170;200;15;CONTROLLEUR-2/C2-OUT-8/LED-29
BARRE NEON - 2M;60;1;1330;0;1330;200;15;CONTROLLEUR-3/C3-OUT-1/LED-30
BARRE NEON - 2M;60;358;1330;200;1330;400;15;CONTROLLEUR-3/C3-OUT-1/LED-31
BARRE NEON - 2M;61;203;1370;0;1370;200;15;CONTROLLEUR-3/C3-OUT-2/LED-32
BARRE NEON - 2M;62;48;1370;200;1370;400;15;CONTROLLEUR-3/C3-OUT-2/LED-33
BARRE NEON - 2M;62;405;1410;0;1410;200;15;CONTROLLEUR-3/C3-OUT-3/LED-34
BARRE NEON - 2M;63;250;1450;0;1450;200;15;CONTROLLEUR-3/C3-OUT-4/LED-35
BARRE NEON - 2M;64;95;1490;0;1490;200;15;CONTROLLEUR-3/C3-OUT-5/LED-36
BARRE NEON - 2M;64;452;1530;0;1530;200;15;CONTROLLEUR-3/C3-OUT-6/LED-37
BARRE NEON - 2M;65;297;1570;0;1570;200;15;CONTROLLEUR-3/C3-OUT-7/LED-38
BARRE NEON - 2M;66;142;1610;0;1610;200;15;CONTROLLEUR-3/C3-OUT-8/LED-39
BARRE NEON - 2M;80;1;1770;0;1770;200;15;CONTROLLEUR-4/C4-OUT-1/LED-40
BARRE NEON - 2M;80;358;1770;200;1770;400;15;CONTROLLEUR-4/C4-OUT-1/LED-41
BARRE NEON - 2M;81;203;1810;0;1810;200;15;CONTROLLEUR-4/C4-OUT-2/LED-42
BARRE NEON - 2M;82;48;1810;200;1810;400;15;CONTROLLEUR-4/C4-OUT-2/LED-43
BARRE NEON - 2M;82;405;1850;0;1850;200;15;CONTROLLEUR-4/C4-OUT-3/LED-44
BARRE NEON - 2M;83;250;1850;200;1850;400;15;CONTROLLEUR-4/C4-OUT-3/LED-45
BARRE NEON - 2M;84;95;1890;0;1890;200;15;CONTROLLEUR-4/C4-OUT-4/LED-46
BARRE NEON - 2M;84;452;1890;200;1890;400;15;CONTROLLEUR-4/C4-OUT-4/LED-47`;

  expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  const blob = createObjectURLMock.mock.calls[0][0];
  if (!(blob instanceof Blob)) {
    throw new Error('Expected a Blob');
  }

  const text = await readBlobContent(blob);
  console.log('RECEIVED CSV:', text.trim());
  expect(text.trim()).toBe(expectedCsv.trim());
};

const thenFileIsDownloaded = (linkMock: HTMLAnchorElement, clickMock: any) => {
  expect(linkMock.setAttribute).toHaveBeenCalledWith('download', 'neon-addressing.csv');
  expect(clickMock).toHaveBeenCalled();
};

const thenNumberOfControllersIs = (wrapper: VueWrapper, expectedCount: number) => {
  const element = wrapper.find('input#controllers-count').element;
  if (!(element instanceof HTMLInputElement)) {
    throw new Error('Element is not an HTMLInputElement');
  }
  expect(Number(element.value)).toBe(expectedCount);
};

const thenControllerCardsAreDisplayed = (wrapper: VueWrapper, expectedCount: number) => {
  const cards = wrapper.findAll('.controller-card');
  expect(cards.length).toBe(expectedCount);
};

const readBlobContent = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise<string>(resolve => {
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      }
    };
    reader.readAsText(blob);
  });
};
