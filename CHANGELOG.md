# Carma API Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

#### Models
| Original | New |
|:---|:---|
| `` | `NotificationRequest` |
| `` | `NotificationRequest.correlationId` |
| `` | `NotificationRequest.noticeNumber` |
| `` | `NotificationRequest.noticeTypeCd` |
| `` | `NotificationRequest.eventDt` |
| `` | `NotificationRequest.eventTypeCd` |
| `` | `NotificationResponse` |
| `` | `NotificationResponse.respCd` |
| `` | `NotificationResponse.respMsg` |

#### API

|Type | Original | New |
|:---|:---|:---|
| Service | `` | `NotificationService` |
| Controller | `` | `NotificationController` |
| Endpoint | `` | `/notification/` |


## [1.0.0] - 2019-04-01
### Added
 - Initial code setup