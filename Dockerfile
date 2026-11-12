# HeyForm Community Edition, packaged for Railway.
# The upstream image is pinned by version and digest. Bump both together
# and add a CHANGELOG.md entry.
FROM heyform/community-edition:v3.0.6@sha256:6acd228065ec2adbcae9e751d9876a9b7b9db0bbc44657a25b83a4822822d1e1

COPY railway-start.sh /usr/local/bin/railway-start.sh
COPY railway-seed.mjs /opt/railway/seed.mjs
RUN chmod 0755 /usr/local/bin/railway-start.sh

EXPOSE 9157
CMD ["/usr/local/bin/railway-start.sh"]
