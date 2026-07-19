import Foundation

/// Minimal ULID generator (Crockford base32, 26 chars) to keep preset IDs
/// in the same format the Go version produced.
enum ULID {
    private static let alphabet = Array("0123456789ABCDEFGHJKMNPQRSTVWXYZ")

    static func generate(now: Date = Date()) -> String {
        var chars = [Character](repeating: "0", count: 26)
        var timestamp = UInt64(now.timeIntervalSince1970 * 1000)
        for i in stride(from: 9, through: 0, by: -1) {
            chars[i] = alphabet[Int(timestamp & 0x1F)]
            timestamp >>= 5
        }
        for i in 10..<26 {
            chars[i] = alphabet[Int.random(in: 0..<32)]
        }
        return String(chars)
    }
}
