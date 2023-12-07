FROM python:3.7

RUN apt update && apt install -y --no-install-recommends \
    sudo gosu less build-essential git vim iputils-ping net-tools dnsutils wget \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install requests beautifulsoup4

RUN echo ALL ALL=\(ALL:ALL\) NOPASSWD: ALL>> /etc/sudoers

COPY ./entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]