FROM python:3.7

RUN apt update && apt install -y --no-install-recommends \
    sudo gosu less build-essential git vim iputils-ping net-tools dnsutils wget \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install requests beautifulsoup4

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && nvm install 22 \
    && corepack enable pnpm

RUN echo ALL ALL=\(ALL:ALL\) NOPASSWD: ALL>> /etc/sudoers

COPY ./entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]
