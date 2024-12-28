FROM python:3.9

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# Install Python dependencies
RUN pip install kerykeion

# Copy function code
COPY . .

# Start the function
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-run", "--allow-read", "--allow-write", "index.ts"]