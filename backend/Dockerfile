# Render などにデプロイするための本番用イメージ
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY src/RealGuild.Api/RealGuild.Api.csproj src/RealGuild.Api/
RUN dotnet restore src/RealGuild.Api/RealGuild.Api.csproj
COPY src/ src/
RUN dotnet publish src/RealGuild.Api/RealGuild.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
# Render は PORT 環境変数でポートを渡す（未設定時は 8080）
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "ASPNETCORE_HTTP_PORTS=${PORT:-8080} exec dotnet RealGuild.Api.dll"]
