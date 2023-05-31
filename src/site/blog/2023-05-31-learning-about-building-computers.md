---
permalink: blog/learning-about-building-computers/index.html
title: "Things I've learned about building computers"
date: 2023-05-31
---

Recently a computer upgrade went from one graphics card to a new case, new fans
and a new graphics card. Along the way I learned a bunch and I'm writing this
blog post for future reference when I next perform a PC upgrade.

## Check your graphics card fits the case

I was upgrading from a very old, and small, GTX 1060 up to a very large
GTX3080...naively assuming that my existing case would fit. It did not!

Lesson learned is to measure or find online the GPU dimensions; all cases will
specify the max size GPU that they support.

## Stock CPU coolers are loud

I had been running the stock AMD CPU cooler since upgrading CPU about 4 years
ago, but when I plugged it in after upgrading the graphics card, it was running
incredibly loud. Not just that, but it would ramp up and down drastically for no
apparent reason.

Swapping this out for a better CPU fan (I went for the
[Noctua NH-U9S](https://noctua.at/en/products/cpu-cooler-retail/nh-u9s)) made a
huge difference. However, the ramping up noise was still there...

## Upgrading the BIOS isn't so scary

My motherboard is roughly 4 years old and I have never upgraded the BIOS. Given
that there had been so many updates over the years since purchase, I decided to
see if any of those might help with the fan ramp-up issue. I also figured it
generally would unlock more efficient running by installing years of bug fixes
and improvements.

The process wasn't too scary; I didn't go for the Q-Flash approach and instead
put the firmware onto a USB, booted into the BIOS and navigated through to the
ugprade options. Just make sure you get the right firmware! I came very close to
running the wrong firmware which would have left me with an expensive brick and
more money to spend on a mobo...

Once the BIOS is updated you might need to re-enable some settings. I had to set
the XMP profile again to make the most out of my RAM, and re-enable
virtualisation (SVM mode for AMD) so that WSL2 functioned correctly.

## Upgrade case fans to PWM

Similarly to the stock cooler, I wasn't that impressed with the fans that came
with my new case
([Fractal XL Silent](https://www.scan.co.uk/products/fractal-design-pop-xl-silent-black-solid))
and they were also 3 pin not 4 pin, which means they are not PWM fans. This
means that the computer can't smartly ramp their RPM up and down based on
temperatures.

Embracing Noctua once more, I went for a few Noctua 120mm PWM fans. I got two of
their premium [A12x25](https://noctua.at/en/products/fan/nf-a12x25-pwm). These
are a bit more expensive, but are incredibly quiet. I then got three more
cheaper [P12 Redux](https://noctua.at/en/nf-p12-redux-1700-pwm) fans to ensure a
lot of airflow through the case.

Going into the BIOS and setting the fan mode to PWM has noticably reduced the
noise of the fans (and temps seem fine still). According to the internet, the
computer should detect PWM fans automatically, but not always. It is best to
explicitly set it if you only have PWM fans setup.

## Positive airflow

Turns out it is important to think about the fans and what direction they are
blowing! It is best to maintain positive pressure in the case, which means more
fans bringing air into the case than blowing it out. Otherwise, in a negative
pressure setup, it is more likely that dust will get sucked into a case that is
desparate for fresh air.

Ideally the air should flow neatly through the case. I have 3 fans at the front
taking air in, and 1 at the front and 1 on top taking air out. I also aligned
the CPU fan with this so it sucks air in the same direction.
