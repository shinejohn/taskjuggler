FROM matrixdotorg/dendrite-monolith:latest

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8008

ENTRYPOINT ["/entrypoint.sh"]
