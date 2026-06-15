FROM livekit/livekit-server:latest

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 7880 7881 7882/udp

ENTRYPOINT ["/entrypoint.sh"]
