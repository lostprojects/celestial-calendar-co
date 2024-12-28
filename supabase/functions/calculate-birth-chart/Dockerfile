FROM denoland/deno:1.37.0

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Kerykeion
RUN pip3 install kerykeion

# The rest is handled by Deno
WORKDIR /app
ADD . .
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--allow-run", "index.ts"]